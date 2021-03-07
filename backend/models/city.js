const mongoose = require('mongoose');

const citySchema = mongoose.Schema({
    id: {type: Number, required: true },
    name: {type: String, required: true },
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

module.exports = mongoose.model("City", citySchema);