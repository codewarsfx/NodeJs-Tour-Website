"use strict";

var asyncErrorCatcher = require('../utils/AsyncErrorCatcher');

var Tour = require('../Models/tourModels');

var Booking = require('../Models/bookingsModel');

var controllerFactory = require('./ControllerFactory');

var stripe = require('stripe')('sk_test_51IjOtBLlSmsaw58gsTlo3DGfHO2kbkKpJb3f4dijaxKs0Xbd6vbJUudKlDzvBezpVL0dLyHFh1ECtfrMhvIGSkmn00xJPb77r9');

exports.createSession = asyncErrorCatcher(function _callee(req, res) {
  var tour, session;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Tour.findById(req.params.tourId));

        case 2:
          tour = _context.sent;
          console.log("".concat(req.protocol, "://").concat(req.get('host'), "/?tour=").concat(tour._id, "&user=").concat(req.user.id, "&price=").concat(tour.price, "&paid=true"));
          _context.next = 6;
          return regeneratorRuntime.awrap(stripe.checkout.sessions.create({
            "cancel_url": "".concat(req.protocol, "://").concat(req.get('host'), "/tour/").concat(tour.slug),
            "success_url": "".concat(req.protocol, "://").concat(req.get('host'), "/?tour=").concat(tour._id, "&user=").concat(req.user.id, "&price=").concat(tour.price, "&paid=true"),
            "client_reference_id": req.params.tourId,
            "customer_email": req.user.email,
            "payment_method_types": ["card"],
            "line_items": [{
              amount: tour.price * 100,
              quantity: 1,
              description: tour.summary,
              images: ["https://drive.google.com/file/d/1hrVFn8DSUMOMZsh38EIW-gmXG6a3yR3r/view?usp=sharing"],
              name: tour.name,
              currency: 'usd'
            }]
          }));

        case 6:
          session = _context.sent;
          res.status(200).json({
            "status": "ok",
            url: session.url
          });

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.createBookings = asyncErrorCatcher(function _callee2(req, res, next) {
  var _req$query, tour, user, price, paid, booking;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$query = req.query, tour = _req$query.tour, user = _req$query.user, price = _req$query.price, paid = _req$query.paid;

          if (!(!tour || !user || !price || !paid)) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", next());

        case 3:
          _context2.next = 5;
          return regeneratorRuntime.awrap(Booking.create({
            tour: tour,
            user: user,
            price: price,
            paid: paid
          }));

        case 5:
          booking = _context2.sent;
          console.log("".concat(req.originalUrl.split('?')[0]));
          res.redirect(301, "".concat(req.originalUrl.split('?')[0]));
          next();

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.getBookings = controllerFactory.getAll(Booking);