var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var AdminSchema = new Schema({
	Name: String,
	Role: Number,
	Email: String
});

module.exports = mongoose.model('Admin',AdminSchema);