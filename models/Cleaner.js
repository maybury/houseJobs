var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var cleanerSchema = new Schema({
	Name: String,
	Email: String
});

module.exports = mongoose.model('Cleaner',cleanerSchema);