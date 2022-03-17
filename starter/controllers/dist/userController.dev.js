"use strict";

var multer = require('multer');

var sharp = require('sharp');

var AsyncErrorCatcher = require('../utils/AsyncErrorCatcher');

var AppError = require('../utils/appError');

var User = require('../Models/userModel');

var controllerFactory = require('./ControllerFactory'); //multer storage configuration that configures the filename and destination of the file upload.
// const storage = multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null, 'starter/public/img/users')
//     },
//     filename:function(req,file,cb){
//         const ext = file.mimetype.split('/')[1]
//         const fileName = `user-${req.user.id}-${Date.now()}.${ext}`
//         cb(null,fileName)
//     }
// })
//define type of multer storage


var storage = multer.memoryStorage(); //multer filter object to filter out file uploads that are not images

var fileFilter = function fileFilter(req, file, cb) {
  if (file.mimetype.split('/')[0] != 'image') {
    cb(new AppError('Please file must be an image', 401));
  }

  cb(null, true);
};

var upload = multer({
  storage: storage,
  fileFilter: fileFilter
}); //image processing middleware 

exports.processImage = AsyncErrorCatcher(function _callee(req, res, next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.file) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", next());

        case 2:
          req.file.filename = "user-".concat(req.user.id, "-").concat(Date.now(), ".jpg");
          _context.next = 5;
          return regeneratorRuntime.awrap(sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({
            quality: 90
          }).toFile("starter/public/img/users/".concat(req.file.filename)));

        case 5:
          next();

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.uploadImage = upload.single('photo'); //cleans up the request body to make sure only a given set of allowed fields can be updated

var cleanUpRequestBody = function cleanUpRequestBody(body) {
  for (var _len = arguments.length, allowedfields = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    allowedfields[_key - 1] = arguments[_key];
  }

  var newBody = {};
  Object.keys(body).forEach(function (el) {
    if (allowedfields.includes(el)) newBody[el] = body[el];
  });
  return newBody;
};

exports.updateSelf = AsyncErrorCatcher(function _callee2(req, res, next) {
  var cleanedRequestBody, userUpdateObject;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(req.body.password || req.body.confirmPassword)) {
            _context2.next = 2;
            break;
          }

          return _context2.abrupt("return", next(new AppError('You can perform password update on this route use /forgotPassword instead')));

        case 2:
          if (req.file) {
            req.body.photo = req.file.filename;
          } //perform updates to user updates but only to specific field


          cleanedRequestBody = cleanUpRequestBody(req.body, "name", "email", "photo");
          _context2.next = 6;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user._id, cleanedRequestBody, {
            runValidators: true,
            "new": true
          }));

        case 6:
          userUpdateObject = _context2.sent;
          res.status(200).json({
            message: "ok",
            data: userUpdateObject
          });

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.userDeleteSelf = AsyncErrorCatcher(function _callee3(req, res, next) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user._id, {
            active: false
          }));

        case 2:
          res.status(204).json({
            message: "User deleted",
            data: null
          });

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
});

exports.getMe = function (req, res, next) {
  req.params.id = req.user.id;
};

exports.createUser = function (req, res, next) {
  return next(new AppError("use the /signup route to create new users", 500));
};

exports.getUsers = controllerFactory.getAll(User);
exports.getUser = controllerFactory.getOne(User);
exports.updateUser = controllerFactory.updateOne(User); //admin delete user permanently from database 

exports.deleteUser = controllerFactory.deleteOne(User);