import mongoose from "mongoose";
import { MONGO_DB_PASSWORD } from "@/libs/constants";

const MONGODB_URI = `mongodb+srv://identity-background-service:${MONGO_DB_PASSWORD}@cennznet-identity.yqg3d.mongodb.net/identity-claims?retryWrites=true&w=majority`;

if (!MONGO_DB_PASSWORD) {
	throw new Error(
		"Please define the MONGO_DB_PASSWORD environment variable inside .env"
	);
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;
if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};

		cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
			return mongoose;
		});
	}
	cached.conn = await cached.promise;
	return cached.conn;
}

export default dbConnect;
