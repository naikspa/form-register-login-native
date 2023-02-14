const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const User = require("./public/user");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

const mongo_uri = "mongodb://127.0.0.1/register-crud";

mongoose.connect(mongo_uri, function (error) {
  if (error) {
    throw error;
  } else {
    console.log(`Succesfully connected to ${mongo_uri}`);
  }
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });

  user.save((err) => {
    if (err) {
      res.status(500).send("ERROR AL REGISTRAR EL USUARIO");
    } else {
      res.status(200).send("USUARIO REGISTRADO");
    }
  });
});

app.post("/authentication", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (err) {
      res.status(500).send("ERROR AL AUTENTICAR EL USUARIO");
    } else if (!user) {
      res.status(500).send("EL USUARIO NO EXISTE");
    } else {
      user.isCorrectPassword(password, (err, result) => {
        if (err) {
          res.status(500).send("ERROR AL AUTENTICAR");
        } else if (result) {
          res.status(200).send("USUARIO AUTENTICADO CORRECTAMENTE");
        } else {
          res.status(500).send("USUARIO Y/O CONTRASEÑA INCORRECTA");
        }
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Server Started");
});
module.exports = app;
