const express = require('express');
const router = express.Router();
const { handleDepositData } = require('../controllers/depositContoller');

router.post('/deposit', handleDepositData);

module.exports = router;
