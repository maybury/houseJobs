var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TaskSchema = new Schema({
	Description: String,
	Completed: Boolean,
	BaseId: ObjectId,
	Base: {type:ObjectId,ref:'TaskSingleton'}
	
});

module.exports = mongoose.model('Task',TaskSchema);