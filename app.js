var express = require('express');
var app = express();
var mongoose = require('mongoose');
const index = require('./routes/index');
const path = __dirname + '/views/';
const bodyParser = require("body-parser");

const Path = require('path');

app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path));

app.use('/css', express.static(Path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(Path.join(__dirname, 'node_modules/bootstrap/dist/js')));


app.use('/', index);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

mongoose.connect(
  `mongodb://root:pass12345@localhost:27017/bookTalk?authSource=admin`,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err, res) => {
    if (err) console.log(`ERROR: connecting to Database.  ${err}`);
    else console.log(`Database Online: ${process.env.MONGO_DB}`);
  }
);
