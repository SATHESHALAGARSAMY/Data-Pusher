const express = require("express");
const account = require("../models/account");
const router = express.Router();

// Define the POST route for creating an account
router.post('/createAccount', account.createAccount);
router.get('/getAccounts', account.getAccounts);
router.get('/getAccountById/:accountId', account.getAccountById);
router.put('/updateAccountById/:accountId', account.updateAccountById);
router.post('/deleteAccountById', account.deleteAccountById);
module.exports = router;
