const express = require('express');
const router = express.Router();
const CityController = require("../controllers/city");
const checkAuth = require('../middleware/check-auth');

router.post("/insert", checkAuth, CityController.addCity);

router.get("/cities", checkAuth, CityController.getCities);

module.exports = router;