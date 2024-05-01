const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const PorjectSchema = Schema({
    name: String,
    description: String,
    imgUrl: [],
    imgUrlPrev: [],
    createdAt: Date
});

module.exports = mongoose.model('Proyecto', PorjectSchema);