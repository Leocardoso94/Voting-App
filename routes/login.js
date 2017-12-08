const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.render('login');
});

router.post('/', function (req, res, next) {
  const { email, password } = req.body;
  console.log(email, password);
  res.render('login');
});


module.exports = router;
