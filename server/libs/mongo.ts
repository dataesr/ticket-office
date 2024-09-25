import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGO_URI || "";
<<<<<<< HEAD
<<<<<<< HEAD
const mongoDatabase = process.env.MONGO_DATABASE || "";
const { MONGO_URI = mongoUri, MONGO_DATABASE = mongoDatabase } = Bun.env;
const client = new MongoClient(MONGO_URI);

const db = client.db(MONGO_DATABASE);
=======
const client = new MongoClient(mongoUri);
=======
const client = new MongoClient(mongoUri, { directConnection: true });
>>>>>>> 3f323e3 (fix(mongo): add directionConnection)
const db = client.db("ticket-office-api");
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)

export default db;
