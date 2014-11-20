var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CrewSchema = new Schema({
	Description: String,
	Cleaners :[{type: ObjectId,ref:'Cleaner'}]
});

module.exports = mongoose.model('Crew',CrewSchema);