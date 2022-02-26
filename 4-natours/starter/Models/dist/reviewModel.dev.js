"use strict";

var mongoose = require('mongoose');

var Tour = require('./tourModels');

var reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Review can not be empty"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    "default": Date.now
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    required: [true, "Tours review must have a tour "]
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "review must belong to a user"]
  }
});
reviewSchema.index({
  user: 1,
  tour: 1
}, {
  unique: true
});

reviewSchema.statics.getReviewStats = function _callee(tourID) {
  var stats;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(this.aggregate([{
            $match: {
              tour: tourID
            }
          }, {
            $group: {
              _id: '$tour',
              ratingsAverage: {
                $avg: '$rating'
              },
              ratingsQuantity: {
                $sum: 1
              }
            }
          }]));

        case 2:
          stats = _context.sent;

          if (!stats) {
            _context.next = 8;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap(Tour.findByIdAndUpdate(tourID, {
            ratingsAverage: Math.round(stats[0].ratingsAverage * 10) / 10,
            ratingsQuantity: stats[0].ratingsQuantity
          }));

        case 6:
          _context.next = 10;
          break;

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(Tour.findByIdAndUpdate(tourID, {
            ratingsAverage: 4.5,
            ratingsQuantity: 0
          }));

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
};

reviewSchema.post('save', function () {
  this.constructor.getReviewStats(this.tour);
});
reviewSchema.pre(/^findOneAnd/, function _callee2(next) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(this.findOne());

        case 2:
          this.r = _context2.sent;
          next();

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this);
});
reviewSchema.post(/^findOneAnd/, function _callee3() {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(this.r.constructor.getReviewStats(this.r.tour));

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  }, null, this);
});
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name"
  });
  next();
});
var reviewModel = mongoose.model("Review", reviewSchema);
module.exports = reviewModel;