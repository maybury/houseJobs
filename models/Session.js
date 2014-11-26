var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var SessionSchema = new Schema({
	CreatedDate:{type:Date, expires:60*60*24}
})

module.exports = mongoose.model('Session',SessionSchema);