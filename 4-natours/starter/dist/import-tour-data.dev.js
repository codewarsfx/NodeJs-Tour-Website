"use strict";

require('dotenv').config({
  path: "".concat(__dirname, "/../.env")
});

var fs = require('fs');

var mongoose = require('mongoose');

var Tour = require('./Models/tourModels');

var Review = require('./Models/reviewModel');

var User = require('./Models/userModel');

var db = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
var reviewData = JSON.parse(fs.readFileSync("".concat(__dirname, "/dev-data/data/reviews.json")));
var tourData = JSON.parse(fs.readFileSync("".concat(__dirname, "/dev-data/data/tours.json")));
var userData = JSON.parse(fs.readFileSync("".concat(__dirname, "/dev-data/data/users.json")));

var addToursToDatabase = function addToursToDatabase() {
  return regeneratorRuntime.async(function addToursToDatabase$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Review.create(reviewData, {
            validateBeforeSave: false
          }));

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(Tour.create(tourData, {
            validateBeforeSave: false
          }));

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(User.create(userData, {
            validateBeforeSave: false
          }));

        case 7:
          process.exit(1);
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0.message);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var deleteAllTours = function deleteAllTours() {
  return regeneratorRuntime.async(function deleteAllTours$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Review.deleteMany());

        case 3:
          _context2.next = 5;
          return regeneratorRuntime.awrap(Tour.deleteMany());

        case 5:
          _context2.next = 7;
          return regeneratorRuntime.awrap(User.deleteMany());

        case 7:
          process.exit(1);
          _context2.next = 13;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0.message);

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(function () {
  if (process.argv[2] === '--import') {
    addToursToDatabase();
  } else if (process.argv[2] === "--delete") {
    deleteAllTours();
  }
});