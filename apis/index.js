const express = require('express');
const router = express.Router();

router.use('/translate', require('./translate'));

module.exports = router;
