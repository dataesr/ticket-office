import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGO_URI || "";
const { MONGO_URI = mongoUri, MONGO_DATABASE = mongoUri } = Bun.env;
const client = new MongoClient(MONGO_URI);

const db = client.db(MONGO_DATABASE);

export default db;
