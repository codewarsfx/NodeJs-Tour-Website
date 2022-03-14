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
          _context.next = 5;
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

        case 5:
          session = _context.sent;
          console.log(session);
          res.status(200).json({
            "status": "ok",
            session: session
          });

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
});