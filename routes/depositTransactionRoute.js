const express = require('express');
const router = express.Router();
const { handleDataOnDeposit } = require('../controllers/depositContoller');

router.post('/deposit', handleDataOnDeposit);

module.exports = router;
