const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/stats');
const checkAuth = require('../middleware/check-auth');


// get mean, max, min
router.get("/one/:fun/:size/:id/:start/:end/:period", checkAuth, StatsController.getOneAggragateFunction);

//get all
router.get("/all/:size/:id/:start/:end/:period", checkAuth, StatsController.getAllFunctions);

module.exports = router;