const express = require('express');
const router = express.Router();
const { handleDataOnDeposit , getTransactions } = require('../controllers/depositContoller');

router.post('/deposit', handleDataOnDeposit);

router.get('/transactions', getTransactions);

module.exports = router;
