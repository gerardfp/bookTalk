var express = require('express');
var app = express();
var mongoose = require('mongoose');
const index = require('./routes/index');
const path = __dirname + '/views/';
const bodyParser = require("body-parser");

//route used to save files
const filesPath = __dirname + '/public/profilePictures/';
exports.filesPath = filesPath;

const Path = require('path');

app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path));

app.use('/css', express.static(Path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(Path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/public', express.static(Path.join(__dirname, '/public/profilePictures')));

app.use('/', index);

//First option is for runing at home, second one is used in a deployment
// app.listen(3000, function () {
//   console.log(`Example app listening on port ${process.env.PORT}!`);
// });
app.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});

mongoose.connect(
  process.env.MONGO_URL,
  //`mongodb://root:pass12345@localhost:27017/bookTalk?authSource=admin`,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err, res) => {
    if (err) console.log(`ERROR: connecting to Database.  ${err}`);
    else console.log(`Database Online: ${process.env.MONGO_DB}`);
  }
);

app.all('*', (req, res) => {
  res.status(404).send('<h1>404! Page not found</h1>');
});