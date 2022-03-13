const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CennznetClaimsSchema = new Schema({
	cennznet_account: {
		type: String,
		required: true,
	},
	account_hash: {
		type: String,
		required: true,
	},
	account_type: {
		type: String,
		required: true,
	},
	verified: {
		type: Boolean,
		required: true,
	},
});

export default mongoose.models.CennznetClaims ||
	mongoose.model("CennznetClaims", CennznetClaimsSchema);
