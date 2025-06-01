// main.js
const express = require("express");
const router = express.Router();
const account = require("../modules/routes/accountroutes");
const destination = require("../modules/routes/destinationroutes");
// Define the POST route for creating an account
router.use('/account', account);
router.use('/destination', destination);
// Export the router
module.exports = router;
