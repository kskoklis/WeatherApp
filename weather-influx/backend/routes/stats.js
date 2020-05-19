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
influxClient.query(`select mean(main_temp) from http where "name" = 'Thessaloniki' and time>='2020-05-06 00:00:00' and time<='2020-05-08 00:00:00' group by time(1h)`) // leitourgei where time='2020-01-12T20:50:00.000Z'
    .then(result => {
        console.log("!!!!!!!!!");
        
        console.log("*******HERE*************"+result);
    });


// get mean, max, min
router.get("/:fun/:size/:id/:start/:end/:period", (req, res, next) => {
    console.log(req.params);
    console.log(`select ` +  req.params.fun + `(` + req.params.size + `) from http where id = ` + req.params.id + ` and time > now() - ` + req.params.start + ` group by time(` + req.params.period + `)`);
    if (req.params.end == "99") { //this condition is true when one of the predifined values are clicked
        influxClient.query(`select ` + req.params.fun + `(` + req.params.size + `) from http where id = ` + req.params.id + ` and time > now() - ` + req.params.start + ` group by time(` + req.params.period + `) fill(none) ; select "name", id from http  where id =` + req.params.id + ` limit 1`)
            .then(result => {
                console.log("Result "+result);
                res.status(200).json({
                    message: "Mean sizes was fetched successfully",
                    result: result
                });
                console.log("asdasdasd", result);
                console.log(req.params.fun);
                
            })
            .catch(err => {
                console.log("asdasdasd");
                res.status(404).json({
                    message: err
                });
            });
    } else {
        console.log("custom");
        console.log(req.params);
        //select Mean(main_temp) from http where  id=734077 and time>='2020-01-06' and time<='2020-01-08' group by time(1h)
        influxClient.query(`select ` + req.params.fun + `(` + req.params.size + `) from http where id = ` + req.params.id + ` and time>='` + req.params.start + `' and time<='` + req.params.end +
        `' group by time(` + req.params.period + `) ; select "name", id from http where id =` + req.params.id + `  limit 1`)
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
    }
    
});

module.exports = router;