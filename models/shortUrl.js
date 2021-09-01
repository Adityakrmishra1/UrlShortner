const mongoose = require('mongoose');
const shortId = require('shortid');
const defaultRegion = "Location Not detected";
const shortUrlSchema = new mongoose.Schema({

	full: {
		type: String,
		required: true,
	},
	short: {
		type: String,
		required: true,
		default: shortId.generate

	},
	created_at: {
		type: String,
		required: true,
		default: new Date().toString().slice(0, 25)
	},
	clicks: {
		type: Number,
		required: true,
		default: 0
	},
	region: {
		type: String,
		required: true,
		default: defaultRegion
	}

}, {

});

module.exports = mongoose.model('ShortUrl', shortUrlSchema);