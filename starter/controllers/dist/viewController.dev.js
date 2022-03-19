"use strict";

var path = require('path');

var stripe = require('stripe');

var asyncErrorCatcher = require('../utils/AsyncErrorCatcher');

var Tour = require('../Models/tourModels');

var Booking = require('../Models/bookingsModel');

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
exports.getTour = asyncErrorCatcher(function _callee2(req, res) {
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

        case 4:
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

exports.userAccount = function (req, res) {
  res.status(200).render('user', {
    title: 'User account page'
  });
};

exports.getUserBookings = asyncErrorCatcher(function _callee3(req, res) {
  var bookingsOnUser, tourIDs, tourData;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Booking.find({
            user: req.user.id
          }));

        case 2:
          bookingsOnUser = _context3.sent;
          tourIDs = bookingsOnUser.map(function (ob) {
            return ob.tour;
          });
          _context3.next = 6;
          return regeneratorRuntime.awrap(Tour.find({
            _id: {
              $in: tourIDs
            }
          }));

        case 6:
          tourData = _context3.sent;
          res.status(200).render('overview', {
            title: " Your Bookings ",
            tourData: tourData
          });

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  });
});

exports.showAlertMiddleWare = function (req, res, next) {
  var bookings = req.query.bookings;

  if (bookings) {
    res.locals.alert = "You tour has been successfully booked. Check below to see list of your booked yours.";
  }

  next();
};