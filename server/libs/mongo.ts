import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGO_URI || "";
const client = new MongoClient(mongoUri);
const db = client.db("ticket-office-api");

export default db;
