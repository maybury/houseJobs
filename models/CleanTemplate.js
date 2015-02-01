var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CleanTemplateSchema = new Schema({
	Description:String,
	BaseTasks: [{type:ObjectId, ref:'TaskSingleton'}]
});

module.exports = mongoose.model('CleanTemplate',CleanTemplateSchema);