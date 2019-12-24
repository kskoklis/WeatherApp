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


influxClient.query(`select distinct("id") as id from http group by "name"`)
    .then(result => {
        console.log(result);
    });
// let id = 734077;// thessaloniki select * from http where id = ${id}
// influxClient.query(`select * from http where main_temp = (select last(main_temp) from http)`)
// .then(res => {
//     console.log(res);
// })

/*  
    name ->city  and sys_country -> country code(GR)
    weather_0_icon
    main_temp -> temperature in Celsius
    weather_0_description
*/
router.get("/inf", (req, res, next) => {
    influxClient.query(`select "name", sys_country, weather_0_icon, last(main_temp), weather_0_description, id from http where id=734077`)
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: "Data was fetched successfully",
            result: result
        });
    })
    .catch(err => {
        res.status(404).json({
            message: "Failed to fetch data"
        });
    });
});

router.get("/inf/:id", (req, res, next) => {
    console.log(req.params.id);
    influxClient.query(`select "name", sys_country, weather_0_icon, last(main_temp), weather_0_description, id from http where id=`+ req.params.id)
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: "Data with specific id was fetched successfully",
            result: result
        });
    })
    .catch(err => {
        res.status(404).json({
            message: "Failed to fetch data"
        });
    });
    //res.status(200).json({ message: "GET id!"});
});

router.get("/towns", (req,res,next) => {    
    influxClient.query(`select distinct("id") as id from http group by "name"`)
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: "Cities was fetched successfully",
            result: result
        });
    })
    .catch(err => {
        res.status(404).json({
            message: "Failed to fetch cities"
        });
    });
});

module.exports = router;