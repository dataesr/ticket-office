import { Elysia } from "elysia"
import { MongoClient } from "mongodb"
import { errorSchema } from "../../../schemas/errors/errorSchema"

const MONGO_URI = process.env.MONGO_URI || ""
const DB_NAME = process.env.MONGO_DATABASE || ""

const client = new MongoClient(MONGO_URI)
await client.connect()
const db = client.db(DB_NAME)

const lastReceivedMail = new Elysia()

lastReceivedMail.get(
  "/get-received-emails",
  async () => {
    const receivedEmailsCollection = db.collection("received_emails")

    const receivedEmails = await receivedEmailsCollection.find().toArray()

    return {
      emails: receivedEmails,
    }
  },
  {
    response: {
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Récupérer les emails reçu",
      description:
        "Cette route permet de récupérer la liste des emails reçu et enregistrés dans la collection 'received_emails' de MongoDB.",
      tags: ["Emails"],
    },
  }
)

export default lastReceivedMail
