"use strict";

var asyncErrorCatcher = require('../utils/AsyncErrorCatcher');

var AppError = require('../utils/appError');

var ApiFeatures = require('../utils/apiFeatures');

exports.deleteOne = function (Doc) {
  return asyncErrorCatcher(function _callee(req, res) {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(Doc.findByIdAndDelete(req.params.id));

          case 2:
            res.status(204).json({
              "message": "success"
            });

          case 3:
          case "end":
            return _context.stop();
        }
      }
    });
  });
};

exports.getOne = function (Doc, populatePath) {
  return asyncErrorCatcher(function _callee2(req, res, next) {
    var DataQueryObject, Data;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            DataQueryObject = Doc.findById(req.params.id);

            if (populatePath) {
              DataQueryObject = DataQueryObject.populate(populatePath);
            }

            _context2.next = 4;
            return regeneratorRuntime.awrap(DataQueryObject);

          case 4:
            Data = _context2.sent;

            if (Data) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt("return", next(new AppError("sorry the document with that ID does not exist", 404)));

          case 7:
            res.status(200).json({
              "message": "success",
              "data": Data
            });

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
};

exports.updateOne = function (Doc) {
  return asyncErrorCatcher(function _callee3(req, res) {
    var updatedDoc;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(Doc.findByIdAndUpdate(req.params.id, req.body, {
              "new": true
            }));

          case 2:
            updatedDoc = _context3.sent;
            res.status(201).json({
              "message": "success",
              "data": updatedDoc
            });

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
};

exports.createOne = function (Doc) {
  return asyncErrorCatcher(function _callee4(req, res, next) {
    var createdDoc;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return regeneratorRuntime.awrap(Doc.create(req.body));

          case 2:
            createdDoc = _context4.sent;
            res.status(200).json({
              status: "success",
              data: createdDoc
            });

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    });
  });
};

exports.getAll = function (Doc) {
  return asyncErrorCatcher(function _callee5(req, res, next) {
    var tourObject, DocQueryObject, data;
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            //for nested get requests 
            tourObject = {};
            if (req.params.tourid) tourObject = {
              tour: req.params.tourid
            };
            DocQueryObject = new ApiFeatures(Doc.find(tourObject), req.query).filter().sort().fieldLimiting().pagination();
            _context5.next = 5;
            return regeneratorRuntime.awrap(DocQueryObject);

          case 5:
            data = _context5.sent;
            //send the response 
            res.status(200).json({
              'message': "success",
              'results': data.length,
              "data": data
            });

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    });
  });
};