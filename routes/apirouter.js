var express = require('express');
var router = express.Router();
const users = require('../database/users');
const USER = users.model;
const USERSCHEMA = users.schema;
var valid = require("../utils/valid");

router.get('/', function(req, res, next) {
  res.render('apirouter', { title: 'Express' });
});

/// insercion de nuevo usuario

  router.post('/users', async(req, res) => {
      var params = req.body;
      params["registerdate"] = new Date();
    // validacion de el orden de los datos
      if(!valid.checkParams(USERSCHEMA, params)){
          res.status(300).json({
              msn: "Datos Iconrrectos"
          });
          return;
      }
    // validacion de Email
      if(!valid.checkEmail(params.email)){
        res.status(300).json({
            msn: "Email Invalido"
        });
        return;
      }
    // validar contraseña
    if(!valid.checkPassword(params.password)){
      res.status(300).json({
          msn: "password incorecto"
      });
      return;
    }
      var users = new USER(params);
      var result = await users.save();
      res.status(200).json(result);
});

/// mostrar usuarios

router.get("/users", (req, res) => {
var params = req.query;
console.log(params);
var limit = 100;
if (params.limit != null) {
        limit = parseInt(params.limit);
      }
var order = -1;
    if (params.order != null) {
        if (params.order == "desc") {
              order = -1;
              } else if (params.order == "asc") {
                    order = 1;
                  }
                }
    var skip = 10;
    if (params.skip != null) {
          skip = parseInt(params.skip);
        }
USER.find({}).limit(limit).sort({_id: order}).skip(skip).exec((err, docs) => {
    res.status(200).json(docs);
      });
});

//creacion de get patch

router.patch("/users", (req, res) => {
  if (req.query.id == null) {
    res.status(300).json({
      msn: "Error no existe id"
      });
        return;
      }
      var id = req.query.id;
      var params = req.body;
      USER.findOneAndUpdate({_id: id}, params, (err, docs) => {
      res.status(200).json(docs);
          });
    });

// creacion delete

router.delete("/users", async(req, res) => {
    if (req.query.id == null) {
          res.status(300).json({
              msn: "Error no existe id"
          });
    return;
  }
var r = await USER.remove({_id: req.query.id});
          res.status(300).json(r);
});

module.exports = router;
