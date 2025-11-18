import { Elysia } from "elysia"
import { MongoClient } from "mongodb"
import { errorSchema } from "../../../schemas/errors/errorSchema"

const MONGO_URI = process.env.MONGO_URI || ""
const DB_NAME = process.env.MONGO_DATABASE || ""

const client = new MongoClient(MONGO_URI)
await client.connect()
const db = client.db(DB_NAME)

const lastSentMail = new Elysia()

lastSentMail.get(
  "/get-sent-emails",
  async ({ set }) => {
    try {
      const sentEmailsCollection = db.collection("sent_emails")

      const sentEmails = await sentEmailsCollection.find().toArray()

      return {
        emails: sentEmails,
      }
    } catch (error) {
      set.status = 500
      return { message: "Error processing request" }
    }
  },
  {
    response: {
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Récupérer les emails envoyés",
      description:
        "Cette route permet de récupérer la liste des emails envoyés et enregistrés dans la collection 'sent_emails' de MongoDB.",
      tags: ["Emails"],
    },
  }
)

export default lastSentMail
