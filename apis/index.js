const express = require('express');
const router = express.Router();

router.use('/translation', require('./translation'));

module.exports = router;
