const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  res.send('this is translate api');
});

module.exports = router;
