const mongoose = require('mongoose');

const citySchema = mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    name: {type: String, required: true }
});

module.exports = mongoose.model("City", citySchema);