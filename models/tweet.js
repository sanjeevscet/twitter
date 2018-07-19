const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
	owner: { type:Schema.type.ObjectId, ref: 'User' },
	content: String,
	created: {type: Date, default: Date.now }
})

module.exports = mongoose.model('Tweet', TweetSchema);