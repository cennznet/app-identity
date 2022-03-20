import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AccountClaimsSchema = new Schema({
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
});

export default mongoose.models.AccountClaims ||
	mongoose.model("AccountClaims", AccountClaimsSchema);
