import { Elysia } from "elysia"
import db from "../../../libs/mongo"
import { errorSchema } from "../../../schemas/errors/errorSchema"

const lastSentMail = new Elysia().get(
  "/get-sent-emails",
  async () => {
    const sentEmails = await db.collection("sent_emails").find().toArray()

    return {
      emails: sentEmails,
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
