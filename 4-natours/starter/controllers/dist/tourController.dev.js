"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Tour = require('../Models/tourModels');

var asyncErrorCatcher = require('../utils/AsyncErrorCatcher');

var ControllerFactory = require("./ControllerFactory");

exports.aliaseController = function (req, res, next) {
  req.query.page = '1';
  req.query.sort = '-price';
  req.query.limit = '5';
  next();
}; //ROUTE HANDLERS 


exports.getTours = ControllerFactory.getAll(Tour);
exports.createTour = ControllerFactory.createOne(Tour);
exports.getTour = ControllerFactory.getOne(Tour, "reviews");
exports.deleteTour = ControllerFactory.deleteOne(Tour);
exports.updateTour = ControllerFactory.updateOne(Tour); // ('/location-within/:distance/center/:latlng/unit/:mi

exports.getLocationsWithinRadius = asyncErrorCatcher(function _callee(req, res) {
  var _req$params, distance, latlng, mi, _latlng$split, _latlng$split2, lat, lng, radius, tourData;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$params = req.params, distance = _req$params.distance, latlng = _req$params.latlng, mi = _req$params.mi;
          _latlng$split = latlng.split(","), _latlng$split2 = _slicedToArray(_latlng$split, 2), lat = _latlng$split2[0], lng = _latlng$split2[1];
          radius = mi === "mi" ? distance / 3963.2 : distance / 6378.1;
          _context.next = 5;
          return regeneratorRuntime.awrap(Tour.find({
            startLocation: {
              $geoWithin: {
                $centerSphere: [[lng, lat], radius]
              }
            }
          }));

        case 5:
          tourData = _context.sent;
          res.status(200).json({
            "status": "Ok",
            "data": {
              length: tourData.length,
              "data": tourData
            }
          });

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}); //geospatial aggregation pipeline for calculating distance of each location from a given point
// exports.calcDistanceFrom = asyncErrorCatcher(async (req,res)=>{
// const {latlang,mi} = req.params
// const [lat, long] = latlang.split(',')
// const tourDistanceData = Tour.aggregate([{
//     $geoNear :{
//     }
// }])
// res.status(200).json({
//     "status":"ok",
//     data:{
//         data:tourDistanceData
//     }
// })   
// }
// )

exports.aggregationPipelineForAVerages = asyncErrorCatcher(function _callee2(req, res) {
  var stats;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Tour.aggregate([{
            $match: {
              ratingsAverage: {
                $gte: 4.5
              }
            }
          }, {
            $group: {
              _id: '$difficulty',
              numberTours: {
                $sum: 1
              },
              numberRatings: {
                $sum: "$ratingsQuantity"
              },
              averageRating: {
                $avg: "$ratingsAverage"
              },
              averagePrice: {
                $avg: "$price"
              },
              minPrice: {
                $min: "$price"
              },
              maxPrice: {
                $max: "$price"
              }
            }
          }, {
            $sort: {
              averagePrice: -1
            }
          }]));

        case 2:
          stats = _context2.sent;
          res.status(200).json({
            "message": "success",
            "data": stats
          });

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.aggregateForBusiestMonth = asyncErrorCatcher(function _callee3(req, res) {
  var year, plan;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          year = req.params.year;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Tour.aggregate([{
            $unwind: "$startDates"
          }, {
            $match: {
              startDates: {
                $gte: new Date("".concat(+year, "-01-01")),
                $lte: new Date("".concat(+year, "-12-31"))
              }
            }
          }, {
            $group: {
              _id: {
                $month: "$startDates"
              },
              numberPerMonth: {
                $sum: 1
              },
              names: {
                $push: "$name"
              }
            }
          }, {
            $sort: {
              numberPerMonth: -1
            }
          }]));

        case 3:
          plan = _context3.sent;
          res.status(200).json({
            "message": "success",
            "data": plan
          });

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
});