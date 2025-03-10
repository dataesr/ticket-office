import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
const mongoDatabase = process.env.MONGO_DATABASE || "ticket-office-staging";
const { MONGO_URI = mongoUri, MONGO_DATABASE = mongoDatabase } = Bun.env;
const client = new MongoClient(MONGO_URI);

const db = client.db(MONGO_DATABASE);

export default db;
