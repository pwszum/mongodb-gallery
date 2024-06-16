const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GallerySchema = new Schema({
	name: { type: String, maxLength: 100, required: true },
	description: { type: String, maxLength: 200 },
	updated: { type: Date },
	user: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { collection: 'galleries' });

// Export model
module.exports = mongoose.model("Gallery", GallerySchema);
