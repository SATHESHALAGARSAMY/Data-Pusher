const express = require("express");
const destination = require("../models/destination");
const router = express.Router();

router.post('/createDestination', destination.createDestination);

module.exports = router;