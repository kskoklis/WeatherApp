const express = require('express');
const fs = require('fs');
const axios = require('axios');
const {exec} = require('child_process');
const router = express.Router();
const mongoose = require('mongoose');
const City = require('../models/city');
const checkAuth = require('../middleware/check-auth');

router.post("/insert", checkAuth, async (req, res, next) => {
    console.log(req.body);
    let apiResponse = await axios.get(`https://openweathermap.org/data/2.5/find?callback=jQuery19107484579824848949_1589908196548&q=${req.body.name}&type=like&sort=population&cnt=30&appid=439d4b804bc8187953eb36d2a8c26a02&_=1589908196549`);
    // console.log(apiResponse.data);
    let apiData = apiResponse.data;
    console.log(apiData.status);
    if (apiResponse.status != 200) {
        return res.status(500).json({
            message: apiResponse.statusText
        });
    }
    
    let pos = apiData.indexOf("(");
    pos++;
    resposeData = apiData.substring(0, apiData.length-1).substring(pos); //remove jQuery19107484579824848949_1589908196548( to parse json
    console.log(resposeData);
    let obj = JSON.parse(resposeData);

    if (obj.list.length == 0) {
        console.log("City not found!");
        return res.status(200).json({
            message: "City not found!"
        });
    }
    console.log(obj.list);
    // console.log(apiData);
    
    
    let checkCityandUser = await City.findOne({ id: obj.list[0].id, userId: mongoose.Types.ObjectId(req.userData.userId)});
    console.log(checkCityandUser);
    // return res.status(200).json();
    // let apiData;
    if (!checkCityandUser) {
        let checkCity = await City.findOne({ id: obj.list[0].id});
        if (!checkCity) {
            let configData;
            let cityName = 'Triadkala';
            //read current telegref configuration
            configData =  fs.readFileSync('/etc/telegraf/telegraf.conf', { encoding: 'utf8', flag: 'r'}); //final path = /root/telegraf.conf

            let old_config;

            // add new line in telegref config for new city
            let newCity = `"http://api.openweathermap.org/data/2.5/weather?id=${req.body.id}&units=metric&APPID=539adaf4b17a8911e564817d0d55d547",\n           ]#add above here`;
            console.log(newCity);
            configData = configData.replace(/\]#add above here/gm, newCity);


            //write changes to telegraf config
            fs.writeFile('/etc/telegraf/telegraf.conf', configData, 'utf8', (err) => { //change file path final path = /etc/telegraf/telegraf.conf
                if (err) return console.log(err);
            });
            
            //restart telegraf service
            let sta = exec("systemctl restart telegraf", (error, stdout, stderr) => { //change status to update
                if (error) {
                    //undo changes
                    fs.writeFile('/etc/telegraf/telegraf.conf', old_config, 'utf8', (err) => { //change file path final path = /etc/telegraf/telegraf.conf
                        if (err) console.log(err);
                    });
                    exec("systemctl restart telegraf");
                    return res.status(500).json({
                        message: "Adding a city failed!"
                    });
                }
                if (stderr) {
                    //undo changes
                    fs.writeFile('/etc/telegraf/telegraf.conf', old_config, 'utf8', (err) => { //change file path final path = /etc/telegraf/telegraf.conf
                        if (err) console.log(err);
                    });
                    exec("systemctl restart telegraf");
                    return res.status(500).json({
                        message: "Adding a city failed!"
                    });
                }
                console.log(`stdout: ${stdout}`);
            });

            const city = new City({
                id: obj.list[0].id,
                name: obj.list[0].name,
                userId: req.userData.userId
            });

            city.save()
            .then(result => {
                res.status(201).json({
                    message: "City was added successfully!",
                    result: result
                });
            })
            .catch(err =>{
                res.status(500).json({
                    message: "Adding a city failed!"
                });
            });
            
        }
        else {
            console.log(checkCity);
            const city = new City({
                id:obj.list[0].id,
                name: obj.list[0].name,
                userId: req.userData.userId
            });
            city.save()
            .then(result => {
                res.status(201).json({
                    message: "City was added successfully!",
                    result: result
                });
            })
            .catch(err =>{
                res.status(500).json({
                    message: "Adding a city failed!"
                });
            });
        }
    }
    else {
        res.status(200).json({
            message: "City has already been added!"
        });
    }
    
     
});

router.get("/cities", checkAuth, (req, res, next) =>{
    City.find({userId: mongoose.Types.ObjectId(req.userData.userId)})
    .then(cities => {
        res.status(200).json({
            message: "Cities fetched successfully!",
            cities: cities
        });
    })
    .catch(err => {
        res.status(500).json({
            message: "Failed to fetch cities!"
        });
    });
});

// let cityName = 'Triadkala';
// request(`https://openweathermap.org/data/2.5/find?callback=jQuery19107484579824848949_1589908196548&q=${cityName}&type=like&sort=population&cnt=30&appid=439d4b804bc8187953eb36d2a8c26a02&_=1589908196549`, (err,response,body) => {
//     if (err) { return console.log(err); }
//     console.log(body);
//     let pos = body.indexOf("(");
//     pos++;
//     resposeData = body.substring(0, body.length-1).substring(pos); //remove jQuery19107484579824848949_1589908196548( to parse json
//     console.log(resposeData);
//     let obj = JSON.parse(resposeData);
//     console.log(obj.cod);
//     if (obj.cod == "200") {
//     console.log(obj);
//     }
//     // if (obj.list.length == 0) {
//     //     console.log("City not found!");
//     //     // this.cityUpdated.next(this.cityInfo);
//     // }
// });

module.exports = router;