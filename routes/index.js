/*
  /routes/index.js
*/
const express = require('express');
const router = express.Router();
const path = require('path');



//Middleware para mostrar datos del request
router.use (function (req,res,next) {
  console.log('/' + req.method);
  next();
});

//Analiza la ruta y el protocolo y reacciona en consecuencia
router.get('/',function(req,res){
  res.sendFile(path.resolve('views/test.html'));
});

router.get('/test',function(req,res){
  res.render('home.pug');
});
module.exports = router;