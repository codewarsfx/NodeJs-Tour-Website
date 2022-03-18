"use strict";

var asyncErrorCatcher = require('../utils/AsyncErrorCatcher');

var Tour = require('../Models/tourModels');

var Booking = require('../Models/bookingsModel');

var User = require('../Models/userModel');

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
          _context.next = 5;
          return regeneratorRuntime.awrap(stripe.checkout.sessions.create({
            "cancel_url": "".concat(req.protocol, "://").concat(req.get('host'), "/tour/").concat(tour.slug),
            "success_url": "".concat(req.protocol, "://").concat(req.get('host'), "/"),
            "client_reference_id": req.params.tourId,
            "customer_email": req.user.email,
            "payment_method_types": ["card"],
            "line_items": [{
              amount: tour.price * 100,
              quantity: 1,
              description: tour.summary,
              images: ["".concat(req.protocol, "://").concat(req.get('host'), "/public/img/tours/").concat(tour.imageCover)],
              name: tour.name,
              currency: 'usd'
            }]
          }));

        case 5:
          session = _context.sent;
          res.status(200).json({
            "status": "ok",
            url: session.url
          });

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}); // exports.createBookings = asyncErrorCatcher(
//     async (req,res,next)=>{
//         const {tour,user,price,paid} = req.query
//         if(!tour||!user||!price||!paid)  return next()
//         const booking = await Booking.create({
//             tour,
//             user,
//             price,
//             paid
//         })
//         res.redirect(301,`${req.originalUrl.split('?')[0]}`)
//          next()
//     }
// )

var createBooking = function createBooking(event, res) {
  var userId;
  return regeneratorRuntime.async(function createBooking$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(event.type == "checkout.session.completed")) {
            _context2.next = 7;
            break;
          }

          _context2.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            email: event.data.object['customer_details'].email
          }));

        case 3:
          userId = _context2.sent._id;
          _context2.next = 6;
          return regeneratorRuntime.awrap(Booking.create({
            tour: event.data.object['client_reference_id'],
            user: userId,
            price: event.data.object['amount_total'] / 100,
            paid: true
          }));

        case 6:
          res.status(200).send('webhook received successfully');

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.webHookBookings = asyncErrorCatcher(function _callee2(req, res) {
  var endpointSecret, event, signature;
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
          event = req.body;

          if (endpointSecret) {
            signature = req.headers['stripe-signature'];

            try {
              event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
              createBooking(event, res);
            } catch (error) {
              console.log('sorry webhook signature verification failed.', error.message);
              res.status(400).send(error.message);
            }
          }

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.getBookings = controllerFactory.getAll(Booking);