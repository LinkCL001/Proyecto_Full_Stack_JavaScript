const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const expressFileUpload = require("express-fileupload");
const port = process.env.PORT || 3000;
const indexRouter = require('./src/router');
app.use(express.static(__dirname + "/src/public"));

app.listen(port, () => {
  console.log(`El servidor está inicializando en el puerto ${port}`);
});

app.set("view engine", "handlebars");

app.set("views", "./src/views");

app.use("/", express.static("public"));

app.use("/imgs", express.static(__dirname + "/rutas/public/imgs"));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist"));
app.use("/bootstrapJS",express.static(__dirname + "/node_modules/bootstrap/dist/js"));

app.use(
  expressFileUpload({
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit:
      "El peso del archivo que intentas subir supera el limite permitido",
  })
);

app.engine(
  "handlebars",
  exphbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/component/",
    helpers: {
      mensajeBienvenida: () => `Bienvenido a Imagenologia`,
    },
  })
);

app.use("/", indexRouter);

app.use(front);
