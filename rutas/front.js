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
  res.render("Registro");
});

rutas.get("/login", (_, res) => {
  res.render("Login");
});

// rutas.get("/paciente", (_, res) => {
//   res.render("Paciente");
// });

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
    res.redirect("/medico"); //si admin false redirect paciente
  }
  next();
};

const validateMedico = async (req, res, next) => {
  //middleware validando medico usando cookies y el token jwt
  const cookies = await getCookies(req.headers.cookie);
  const token = await validateToken(cookies.token);
  if (!token.data.medico) {
    res.redirect("/admin"); //si medico false redirect paciente
  }
  next();
};

const validatePaciente = async (req, res, next) => {
  //middleware validando medico usando cookies y el token jwt
  const cookies = await getCookies(req.headers.cookie);
  const token = await validateToken(cookies.token);
  if (!token.data) {
    res.redirect("/"); //si medico false redirect paciente
  }
  next();
};

rutas.get("/admin", validateAdmin, async (_, res) => {
  //ruta admin con axios
  axios
    .get("http://localhost:3000/pacientes")
    .then((response) => {
//      console.log(response.data);
      res.render("Admin", { pacientes: response.data }); //render a admin con la data pacientes para rellenar la tabla
    })
    .catch((e) => {
      console.log(e);
    });
});

rutas.get("/medico", validateMedico, async (_, res) => {
  axios
    .get("http://localhost:3000/pacientes") 
    .then((response) => {
//      console.log(response.data);
      res.render("Medico", { pacientes: response.data }); //rendereando la data del paciente hacia medico handlebars
    })
    .catch((e) => {
      console.log(e);
    });
});

rutas.get("/paciente", validatePaciente ,async (req, res) => {
  axios
    .get("http://localhost:3000/paciente") //obteniendo id para ingresar con usuario con su id respectiva
    .then((response) => {
     console.log(response.data[0]);
      res.render("Paciente", { paciente: response.data}); //rendereando la data del paciente hacia datos handlebars
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
      } else if (user.data.medico){//si es medico
        res.cookie("token", response.data.token);
        res.cookie("test", response.data.token);
        res.redirect("/Medico"); //redirige a medico
      } else {//de lo contrario
        res.cookie("token", response.data.token);
        res.redirect("/Paciente"); // redirige a paciente
      }
    })
    .catch((e) => {
      console.log(e);
      res.render("error", {title:`Ups!! algo a salido mal`, message: 'Usuario o contraseña incorrecta'})
    });
});

rutas.post("/paciente-delete/:rut", async (req, res) => {//eliminar usuario
  const { rut } = req.params;// obtener rut desde params
//  console.log(token);
  axios
    .get(`http://localhost:3000/pacientes/${token.data.rut}`)//obtener data del id con axios
    .then((response) => {
      console.log(response.data);
      res.render("datos", { paciente: response.data });// renderea a datos con la data obtenida de axios
    })
    .catch((e) => {
      console.log(e);
    });
  const pacientes = await db.listar();//lo busca en la base de datos
  res.render("Delete", { pacientes });
});

rutas.post("/paciente/:rut", async (req, res) => {//eliminar editar y cambiar estado en una ruta post
  const { rut } = req.params;
  const { action } = req.body;
  switch (action) {
    case "editar"://editar usando la data obtenida del body
      delete req.body.action;
      try {
        await db.update(rut, req.body).then(() => res.redirect("/"));//editando con su rut y utilizandom informacion actualizada del body, para luego redireccionar al inicio
      } catch (e) {
        res.render("error", { title: "Error al editar usuario", message: e });
      }
      break;
    case "eliminar"://eliminar usando axios con el id ya obtenido en la linea 110
      axios
        .delete(`http://localhost:3000/pacientes/${rut}`)
        .then((response) => {
//          console.log(response);
          let message = 'No se pudo eliminar el Paciente';
          if (response.data.pacienteDelete.rowCount > 0) {
            message = 'Usuario Eliminado'
          }
          res.render("Dashboard", { pacientes: response.data.pacientes, message })//al eliminar renderea al home
        })
        .catch((e) => {
          console.log(e);
        });
      break;
    case "updateStatus":
      const { medico } = req.body;// obtiene estado desde el body
      try {
        await db.updateStatus(rut, !!medico).then(() => res.redirect("/Admin"));//estado false redirige a admin
      } catch (e) {
        res.render("error", { title: "Error al editar medico", message: e });
      }
      break;
    default:
      break;
  }
});

rutas.put("/update-estado/:rut", async (req, res) => {// editar estado boolerano false a true 
  const { rut } = req.params;//obtener id desde params
  const medico = Object.values(req.body);//obtener estado desde el body
  const result = await updateStatus(medico, rut);//llamar a la funcion de la bd
  result > 0
    ? res.status(200).send(true)
    : console.log("Error al editar Medico");
});

module.exports = rutas;
