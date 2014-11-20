var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CleanSchema = new Schema({
	Description: String,
	Crew: {type: ObjectId, ref: 'Crew'},
	Tasks: [{type:ObjectId, ref:'Task'}],
	DueDate: Number,
	FineDate: Number,
	CheckedOff: Boolean,
	CleanersToCheckoff: [{type:ObjectId, ref:'Cleaner'}],
	FineAmount: Number,
	Fined: Boolean
	
});

module.exports = mongoose.model('Clean',CleanSchema);