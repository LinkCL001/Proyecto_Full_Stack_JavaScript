const { Router } = require("express");
const db = require("../src/models/db");
const rutas = Router();
const axios = require("axios");
const secretKey = process.env["SECRET_KEY"];
const jwt = require("jsonwebtoken");
// const { v4: uuidv4 } = require('uuid');
const { response } = require("express");

const URL_BACKEND = "http://localhost:3000";

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
    res.redirect("/"); //si admin false redirect main
  }
  next();
};

const validateMedico = async (req, res, next) => {
  //middleware validando medico usando cookies y el token jwt
  const cookies = await getCookies(req.headers.cookie);
  const token = await validateToken(cookies.token);
  if (!token.data.medico) {
    res.redirect("/"); //si medico false redirect main
  }
  next();
};

const validatePaciente = async (req, res, next) => {
  //middleware validando medico usando cookies y el token jwt
  const cookies = await getCookies(req.headers.cookie);
  const token = await validateToken(cookies.token);
  if (!token.data) {
    res.redirect("/"); //si medico false redirect main
  }
  req.token = token;
  next();
};

rutas.get("/admin", validateAdmin, async (_, res) => {
  //ruta admin con axios
  axios
    .get(`${URL_BACKEND}/api/pacientes`)
    .then((response) => {
      res.render("Admin", { pacientes: response.data }); //render a admin con la data pacientes para rellenar la tabla
    })
    .catch((e) => {
      console.log(e);
    });
});

rutas.get("/medico", validateMedico, async (_, res) => {
  axios
    .get(`${URL_BACKEND}/api/pacientes`)
    .then((response) => {
      res.render("Medico", { pacientes: response.data }); //rendereando la data del paciente hacia medico handlebars
    })
    .catch((e) => {
      console.log(e);
    });
});

rutas.get("/paciente", validatePaciente, async (req, res) => {
  axios
    .get(`${URL_BACKEND}/api/paciente/${req.token.data.id}`) //obteniendo id para ingresar con usuario con su rut respectiva
    .then((response) => {
      res.render("Paciente", { usuarios: response.data }); //rendereando la data del paciente hacia datos handlebars
    })
    .catch((e) => {
      console.log(e);
    });
});

rutas.get("/pedir-examenes", validatePaciente, async (req, res) => { //validatePaciente,
  axios
    .get(`${URL_BACKEND}/api/examenes`)
    .then((response) => {
      res.render("Examenes", { examenes: response.data });
    })
    .catch((e) => {
      console.log(e);
    });
});

rutas.post("/pedir-examenes", validatePaciente, async (req, res) => { //
  axios
  .get(`${URL_BACKEND}/api/horas`)
  .then((response) => {
    res.render("Horas", { horas: response.data });
  })
  .catch((e) => {
    console.log(e);
  });


    //console.log(req.body.id_examen[0]);
    //const id_examen = req.body.id_examen[0];
    // const fecha = req.body.fecha;
    // const activa = req.body.activa
    // try {
    //   await db.listarHoras().then(() => res.render("Horas", { horas: response.data }));//editando con su id y utilizandom informacion actualizada del body, para luego redireccionar al inicio
    // } catch (e) {
    //   res.render("error", { title: "Error al listar las horas", message: e });
    // }
    // res.send("info recibida")

  //  const id = req.token.data.id
 
  // const fotos  = req.files.orden_medica;
  // fotos.mv(`${__dirname}/public/imgs/${id}+${fotos.name}`, (e) => {//guardando la foto en directorio con id
  //   if (e) {
  //     console.log(e);
  //   }else {
  //     db.ingresarHoras((id, req.body).then(() => res.redirect("/pedir-hora")));
  //     console.log("Archivo subido con exito");
  //   }
  // });
  // req.body.foto = fotos.name;

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
    edad,
    password,
    direccion,
    comuna,
    telefono,
    prevision,
  } = req.body;
  try {
    const response = await axios.post("http://localhost:3000/api/paciente", {
      rut,
      email,
      nombres,
      primer_apellido,
      segundo_apellido,
      sexo,
      fecha_nacimiento,
      edad,
      password,
      direccion,
      comuna,
      telefono,
      prevision,
      medico: false,
      admin: false,
    });
    return res.redirect("/login");
  } catch (e) {
    console.log(e);
  }
  res.render("error", {
    title: `Ups!! algo a salido mal`,
    message: `El Usuario ${nombres} ya existe`,
  });
});

rutas.post("/login-inicio", async (req, res) => {
  const { email, password } = req.body; //se obtiene del body email password
  axios
    .post("http://localhost:3000/api/login", { email, password }) //se ingresa la data por axios
    .then(async (response) => {
      const user = await jwt.verify(response.data.token, secretKey); //verificar token usuario
      //console.log(user);
      if (user.data.admin) {
        //si es admin
        res.cookie("token", response.data.token);
        res.redirect("/admin"); //redirige a admin
      } else if (user.data.medico) {
        //si es medico
        res.cookie("token", response.data.token);
        res.redirect("/medico"); //redirige a medico
      } else if (user.data) {
        //de lo contrario
        res.cookie("token", response.data.token);
        res.redirect("/paciente"); // redirige a paciente
      }
    })
    .catch((e) => {
      console.log(e);
      res.render("error", {
        title: `Ups!! algo a salido mal`,
        message: "Usuario o contraseña incorrecta",
      });
    });
});

// rutas.post("/paciente-delete/:id", async (req, res) => {
//   //eliminar usuario
//   const { id } = req.params; // obtener rut desde params
//   axios
//     .get(`http://localhost:3000/api/paciente/${token.data.id}`) //obtener data del id con axios
//     .then((response) => {
//       res.render("paciente", { usuario: response.data }); // renderea a datos con la data obtenida de axios
//     })
//     .catch((e) => {
//       console.log(e);
//     });
//   const usuarios = await db.listar(); //lo busca en la base de datos
//   res.render("Delete", { usuarios });
// });

rutas.post("/paciente-update/:id", async (req, res) => {//eliminar editar y cambiar estado en una ruta post
  const { id } = req.params;
  const { action } = req.body;
  switch (action) {
    case "editar"://editar usando la data obtenida del body
      delete req.body.action;
      try {
        await db.update(id, req.body).then(() => res.redirect("/paciente"));//editando con su id y utilizandom informacion actualizada del body, para luego redireccionar al inicio
      } catch (e) {
        res.render("error", { title: "Error al editar usuario", message: e });
      }
      break;
    case "eliminar": //eliminar usando axios con el id ya obtenido en la linea 110
      axios
        .delete(`http://localhost:3000/api/paciente/${id}`)
        .then((response) => {
          let message = "No se pudo eliminar el Paciente";
          if (response.data.pacienteDelete.rowCount > 0) {
            message = "Usuario Eliminado";
          }
          res.render("Login", {
            usuario: response.data.usuario,
            message,
          }); //al eliminar renderea al home
        })
        .catch((e) => {
          console.log(e);
        });
      break;
    case "updateStatus":
      const { activa } = req.body; // obtiene estado desde el body
      try {
        await db.updateStatus(id, !!activa).then(() => res.redirect("/Admin")); //estado false redirige a admin
      } catch (e) {
        res.render("error", { title: "Error al editar estado", message: e });
      }
      break;
    default:
      break;
  }
});

rutas.put("/update-estado/:id", async (req, res) => {
  // editar estado boolerano false a true
  const { id } = req.params; //obtener id desde params
  const activa = Object.values(req.body); //obtener estado desde el body
  const result = await updateStatus(id, activa); //llamar a la funcion de la bd
  result > 0
    ? res.status(200).send(true)
    : console.log("Error al editar hora");
});

module.exports = rutas;
