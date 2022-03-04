"use strict";

/*eslint-disable*/
console.log('hey');
document.querySelector('.form').addEventListener('submit', function (e) {
  console.log('hey');
  e.preventDefault();
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  console.log(email, password);
});