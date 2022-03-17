"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var nodemailer = require('nodemailer');

var nodemailerSengrid = require('nodemailer-sendgrid');

var pug = require('pug');

var _require = require('html-to-text'),
    htmlToText = _require.htmlToText;

module.exports =
/*#__PURE__*/
function () {
  function _class(user, url) {
    _classCallCheck(this, _class);

    this.url = url;
    this.firstName = user.name.split(' ')[0];
    this.to = user.email;
    this.from = "Chidera Innocent ".concat(process.env.SENDER_EMAIL);
  }

  _createClass(_class, [{
    key: "createTransport",
    value: function createTransport() {
      return regeneratorRuntime.async(function createTransport$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(process.env.NODE_ENV == "production")) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", this.transporter = nodemailer.createTransport(nodemailerSengrid({
                apiKey: process.env.SENDGRID_API_KEY
              })));

            case 2:
              _context.next = 4;
              return regeneratorRuntime.awrap(nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASSWORD
                }
              }));

            case 4:
              this.transporter = _context.sent;

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "sendEmail",
    value: function sendEmail(template, subject) {
      var html, text, emailOptions;
      return regeneratorRuntime.async(function sendEmail$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(pug.renderFile("".concat(__dirname, "/../views/email/").concat(template, ".pug"), {
                url: this.url,
                firstName: this.firstName
              }));

            case 2:
              html = _context2.sent;
              _context2.next = 5;
              return regeneratorRuntime.awrap(htmlToText(html));

            case 5:
              text = _context2.sent;
              //define the email options 
              emailOptions = {
                from: this.from,
                to: this.to,
                subject: subject,
                html: html,
                text: text
              };
              _context2.next = 9;
              return regeneratorRuntime.awrap(this.createTransport());

            case 9:
              _context2.next = 11;
              return regeneratorRuntime.awrap(this.transporter.sendMail(emailOptions));

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "sendWelcome",
    value: function sendWelcome() {
      return regeneratorRuntime.async(function sendWelcome$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(this.sendEmail('welcome', 'WELCOME'));

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "sendPasswordReset",
    value: function sendPasswordReset() {
      return regeneratorRuntime.async(function sendPasswordReset$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(this.sendEmail('emailReset', "PASSWORD_RESET TOKEN FOR ".concat(this.to, " ")));

            case 2:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }]);

  return _class;
}();

console.log('h');