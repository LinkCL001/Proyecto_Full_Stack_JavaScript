const { Router } = require("express");
const db = require("../src/models/db");
const rutas = Router();
const axios = require("axios");
const secretKey = process.env["SECRET_KEY"];
const jwt = require("jsonwebtoken");
const { response } = require("express");

rutas.get("/", (_, res) => {
  res.render("Dashboard");
});

rutas.get("/paciente-create", (_, res) => {
  res.render("registro");
});

rutas.get("/login", (_, res) => {
  res.render("login");
});

const getCookies = (cookiesString) => {
  //recibir token de las cookies
  const cookies = cookiesString.split("; ").reduce((prev, current) => {
    const [name, ...value] = current.split("=");
    prev[name] = value.join("=");
    return prev;
  }, {});
  return cookies; //transformando token en un objeto
};

const validateToken = async (token) => {
  if (!token) {
    res.redirect("/login"); //usuario sin token redirect login
  }
  const user = await jwt.verify(token, secretKey);
  return user; //si existe lo devuelve como dato
};

const validateAdmin = async (req, res, next) => {
  //middleware validando admin usando cookies y el token jwt
  const cookies = await getCookies(req.headers.cookie);
  const token = await validateToken(cookies.token);
  if (!token.data.admin) {
    res.redirect("/datos"); //si admin false redirect datos
  }
  next();
};

rutas.get("/admin", validateAdmin, async (_, res) => {
  //ruta admin con axios
  axios
    .get("http://localhost:3000/pacientes")
    .then((response) => {
      console.log(response.data);
      res.render("admin", { pacientes: response.data }); //render a admin con la data pacientes para rellenar la tabla
    })
    .catch((e) => {
      console.log(e);
    });
});

rutas.get("/datos", async (req, res) => {
  // validando usuario no admin usando cookies del headers y el token
  const cookies = await getCookies(req.headers.cookie);
  const token = await validateToken(cookies.token);
  console.log(token);
  axios
    .get(`http://localhost:3000/pacientes/${token.data.rut}`) //obteniendo id para ingresar con usuario con su id respectiva
    .then((response) => {
      console.log(response.data);
      res.render("datos", { paciente: response.data }); //rendereando la data del paciente hacia datos handlebars
    })
    .catch((e) => {
      console.log(e);
    });
});

rutas.post("/paciente-create", async (req, res) => {
  const {
    rut,
    email,
    nombres,
    primer_apellido,
    segundo_apellido,
    sexo,
    fecha_nacimiento,
    password,
    direccion,
    comuna,
    telefono,
    prevision,
  } = req.body;

  try {
    const response = await axios.post("http://localhost:3000/paciente", {
      rut,
      email,
      nombres,
      primer_apellido,
      segundo_apellido,
      sexo,
      fecha_nacimiento,
      password,
      direccion,
      comuna,
      telefono,
      prevision,
      medico:false,
      admin:false,
    });
    return res.redirect("/")
  } catch (e) {console.log(e)}
    res.render("error", { title:`Ups!! algo a salido mal`, message:`El Usuario ${nombres} ya existe` })
});

rutas.post("/login-inicio", async (req, res) => {
  //se obtiene del body email password
  const { email, password } = req.body;
  axios
    .post("http://localhost:3000/login", { email, password }) //se ingresa la data por axios
    .then(async (response) => {
      console.log(response);
      const user = await jwt.verify(response.data.token, secretKey); //verificar token usuario
      if (user.data.admin) {
        //si es admin
        res.cookie("token", response.data.token);
        res.cookie("test", response.data.token);
        res.redirect("/Admin"); //redirige a admin
      } else {
        res.cookie("token", response.data.token);
        res.redirect("/datos"); //de lo contrario redirige a datos de usuario
      }
    })
    .catch((e) => {
      console.log(e);
      res.render("error", {title:`Ups!! algo a salido mal`, message: 'Usuario o contraseña incorrecta'})
    });
});

module.exports = rutas;
