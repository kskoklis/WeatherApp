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


influxClient.query(`select "name", sys_country, weather_0_icon, last(main_temp), weather_0_description from http limit 2`)
    .then(result => {
        console.log(result['0'].name);
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
router.get("", (req, res, next) => {
    influxClient.query(`select "name", sys_country, weather_0_icon, last(main_temp), weather_0_description from http`)
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

module.exports = router;