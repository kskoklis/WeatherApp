const express = require('express');
const fs = require('fs');
const {exec} = require('child_process');
const router = express.Router();
const mongoose = require('mongoose');
const City = require('../models/city');
const checkAuth = require('../middleware/check-auth');

router.post("/insert", checkAuth, async (req, res, next) => {

    let checkCityandUser = await City.findOne({ id: req.body.id, userId: mongoose.Types.ObjectId(req.userData.userId)});

    console.log(checkCityandUser);
    if (!checkCityandUser) {
        let checkCity = await City.findOne({ id: req.body.id});
        if (!checkCity) {
            let configData;
            
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
                id: req.body.id,
                name: req.body.name,
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
            const city = new City({
                id:req.body.id,
                name: req.body.name,
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



module.exports = router;