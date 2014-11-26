var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var cleanerSchema = new Schema({
	Name: String,
	Email: String,
	Role: Number
});

module.exports = mongoose.model('Cleaner',cleanerSchema);