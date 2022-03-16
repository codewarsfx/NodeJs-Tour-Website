"use strict";

var asyncErrorCatcher = require('../utils/AsyncErrorCatcher');

var Tour = require('../Models/tourModels');

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
          console.log("https://www.natours.dev/img/tours/".concat(tour.imageCover));
          _context.next = 6;
          return regeneratorRuntime.awrap(stripe.checkout.sessions.create({
            "cancel_url": "".concat(req.protocol, "://").concat(req.get('host'), "/tours"),
            "success_url": "".concat(req.protocol, "://").concat(req.get('host'), "/tours/").concat(tour.slug),
            "client_reference_id": req.params.tourId,
            "customer_email": req.user.email,
            "payment_method_types": ["card"],
            "line_items": [{
              amount: tour.price * 100,
              quantity: 1,
              description: tour.summary,
              images: ["https://www.natours.dev/img/tours/".concat(tour.imageCover)],
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