"use strict";

var path = require('path');

var asyncErrorCatcher = require('../utils/AsyncErrorCatcher');

var Tour = require('../Models/tourModels');

exports.getOverview = asyncErrorCatcher(function _callee(req, res) {
  var tourData;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Tour.find());

        case 2:
          tourData = _context.sent;
          res.status(200).render(path.join(__dirname, '../views/overview'), {
            title: "Tours overview page ",
            tourData: tourData
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.getTour = asyncErrorCatcher(function _callee2(req, res, next) {
  var tour;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Tour.findOne({
            slug: req.params.slug
          }).populate({
            path: 'reviews'
          }));

        case 2:
          tour = _context2.sent;
          res.status(200).render('tour', {
            title: "".concat(tour.name, " Tour"),
            tour: tour
          });
          next();

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
});

exports.login = function (req, res) {
  res.status(200).render('login', {
    title: "Welcome to Natours Login to Continue"
  });
};