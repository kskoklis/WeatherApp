const express = require('express');
const router = express.Router();
const InfluxdbController = require('../controllers/influxdb');
const conn = require('../middleware/connect-influx');

router.get("/inf", conn, InfluxdbController.getThessWeatherInfo);

router.get("/inf/:id", InfluxdbController.getCityWeatherInfo);

router.get("/towns", InfluxdbController.getInfluxCities);

module.exports = router;