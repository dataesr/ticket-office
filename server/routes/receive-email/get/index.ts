import { Elysia } from "elysia";
import db from "../../../libs/mongo";
import { errorSchema } from "../../../schemas/errors/errorSchema";

const lastReceivedMail = new Elysia().get(
  "/get-received-emails",
  async () => {
    const receivedEmails = await db
      .collection("received_emails")
      .find({}, { projection: { rawContent: 0 } })
      .toArray();

    return {
      emails: receivedEmails,
    };
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
);

export default lastReceivedMail;
