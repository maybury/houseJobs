var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TaskSingletonSchema = new Schema({
	Description: String
	
});

module.exports = mongoose.model('TaskSingleton',TaskSingletonSchema);