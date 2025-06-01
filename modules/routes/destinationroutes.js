const express = require("express");
const destination = require("../models/destination");
const router = express.Router();

router.post('/createDestination', destination.createDestination);
router.get('/getAllDestinations/:accountId', destination.getAllDestinations);
router.get('/getDestinationById/:destinationId', destination.getDestinationById);
router.put('/updateDestinationById', destination.updateDestinationById);
router.post('/deleteDestinationById', destination.deleteDestinationById);
router.post('/deleteAllDestinationsByAccountId', destination.deleteAllDestinationsByAccountId);

module.exports = router;
