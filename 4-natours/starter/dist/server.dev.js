"use strict";

require('dotenv').config({
  path: "".concat(__dirname, "/../config.env")
});

var mongoose = require('mongoose');

var app = require('./app');

var db = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD); //catching synchronous errors around th

process.on('uncaughtException', function (error) {
  console.error(error.message, error.name);
  process.exit(1);
}); //connect to mongoose db atlas server

mongoose.connect(db, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(function () {
  console.log('database connected successfully');
}); //SERVER

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  console.log("app is running on port ".concat(port));
}); // catching async errors    

process.on("unhandledRejection", function (error) {
  console.error(error.message, error.name);
  server.close(function () {
    console.log("shutting down the server cause an error occured...");
    process.exit(1);
  });
});