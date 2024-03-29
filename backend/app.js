const express = require('express');

const mongoose = require('mongoose');
const router = express.Router();
const bodyParser = require('body-parser');
const userRoutes = require("./routes/user");
const weatherRoutes = require("./routes/influxdb");
const statsRoutes = require("./routes/stats");
const cityRoutes = require("./routes/city");
const dotEnv = require('dotenv');

const app = express();
dotEnv.config();
mongoose.connect("mongodb://admin:" + process.env.MONGO_PW + "@127.0.0.1:27017/users?authSource=admin", { useCreateIndex: true, useNewUrlParser: true})
.then(()=>{
    console.log('Connected to database');
})
.catch(()=>{
    console.log('Connection failed!');
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});


app.use("/api/user", userRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/city", cityRoutes);
module.exports = app;