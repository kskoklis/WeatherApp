const express = require('express');
const influx = require('influx');
const router = express.Router();

const influxClient = new influx.InfluxDB({
    host: '127.0.0.1',
    database: 'api_response'
}); 

influxClient.getDatabaseNames()
.then(names => {
    if(names.includes('api_response')){
        console.log("Connected to InfluxDB");
    }
})
.catch(err => {
    console.error("Error database doesn't exists!!");
});
// //max, min, mean
// //temp -> main_temp, humidity -> main_humidity, wind speed -> wind_speed, clouds -> clouds_all
influxClient.query(`select mean(main_temp) from http where "name" = 'Thessaloniki' and time>='2020-01-06 00:00:00' and time<='2020-01-08 00:00:00' group by time(1d)`) // leitourgei where time='2020-01-12T20:50:00.000Z'
    .then(result => {
        console.log(result);
    });


// get mean
router.get("/mean/:size/:city/:start/:end/:period", (req, res, next) => {
    console.log(req.params);
    influxClient.query(`select mean(` + req.params.size + `) from http where "name" = '` + req.params.city + `' and time>='` + req.params.start + `' and time<='` + req.params.end +
     `' group by "name",time(` + req.params.period + `)`)
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Mean sizes was fetched successfully",
                result: result
            });
        })
        .catch(err => {
            res.status(404).json({
                message: "Failed to fetch data"
            });
        });
    
});

//get max
router.get("/max/:size/:city/:start/:end/:period", (req, res, next) => {
    console.log(req.params);
    influxClient.query(`select max(` + req.params.size + `) from http where where "name" = '` + req.params.city + `' and time>='` + req.params.start + `' and time<='` + req.params.end +
     `' group by "name",time(` + req.params.period + `)`)
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Max sizes was fetched successfully",
                result: result
            });
        })
        .catch(err => {
            res.status(404).json({
                message: "Failed to fetch data"
            });
        });
    
});


//get min
router.get("/min/:size/:city/:start/:end/:period", (req, res, next) => {
    console.log(req.params);
    influxClient.query(`select min(` + req.params.size + `) from http where where "name" = '` + req.params.city + `' and time>='` + req.params.start + `' and time<='` + req.params.end +
     `' group by "name",time(` + req.params.period + `)`)
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Min sizes was fetched successfully",
                result: result
            });
        })
        .catch(err => {
            res.status(404).json({
                message: "Failed to fetch data"
            });
        });
    
});

module.exports = router;