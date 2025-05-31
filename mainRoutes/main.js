// main.js
const express = require("express");
const router = express.Router();
const account = require("../modules/routes/accountroutes");
// Define the POST route for creating an account
router.use('/account', account);

// Export the router
module.exports = router;