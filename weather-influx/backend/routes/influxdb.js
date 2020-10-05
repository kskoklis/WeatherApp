const express = require('express');
const router = express.Router();
const InfluxdbController = require('../controllers/influxdb');

router.get("/inf", InfluxdbController.getThessWeatherInfo);

router.get("/inf/:id", InfluxdbController.getCityWeatherInfo);

router.get("/towns", InfluxdbController.getInfluxCities);

module.exports = router;