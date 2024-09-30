import { Elysia } from "elysia";
import { MongoClient, ObjectId } from "mongodb";
import { errorSchema } from "../../schemas/errors/errorSchema";

const MONGO_URI = process.env.MONGO_URI || "";
const DB_NAME = process.env.MONGO_DATABASE || "";

const client = new MongoClient(MONGO_URI);
await client.connect();
const db = client.db(DB_NAME);

const sendMail = new Elysia();

sendMail.post(
  "/send-email",
  async ({
    body,
  }: {
    body: {
      contributionId: string;
      to: string;
      name: string;
      subject: string;
      userResponse: string;
      selectedProfile: string;
      message: string;
      collectionName: string;
    };
  }) => {
    const {
      to,
      name,
      subject,
      userResponse,
      selectedProfile,
      message,
      contributionId,
      collectionName,
    } = body;
    const allowedCollections = [
      "contacts",
      "contribute",
      "contribute_productions",
      "remove-user",
      "update-user-data",
    ];

    if (!allowedCollections.includes(collectionName)) {
      return {
        success: false,
        error: `La collection ${collectionName} n'est pas autorisée.`,
      };
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) {
      return {
        success: false,
        error: "BREVO_API_KEY is not defined",
      };
    }

    const dataForBrevo = {
      sender: {
        email: "scanr@recherche.gouv.fr",
        name: `${selectedProfile} de l'équipe scanR`,
      },
      to: [{ email: to, name: name }],
      replyTo: { email: "scanr@recherche.gouv.fr", name: "L'équipe scanR" },
      subject: subject,
      templateId: 262,
      params: {
        date: new Date().toLocaleDateString("fr-FR"),
        userResponse,
        message,
        selectedProfile,
      },
    };

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(dataForBrevo),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Erreur d'envoi: ${response.statusText}`,
      };
    }
    const collection = db.collection(collectionName);
    const existingDoc = await collection.findOne({
      _id: new ObjectId(contributionId),
    });

    if (!existingDoc) {
      return {
        success: false,
        error: "Document not found",
      };
    }

    const updatedThreads = existingDoc.threads || [];
    updatedThreads.push({
      threadId: new Date().toISOString(),
      responses: [
        {
          responseMessage: userResponse,
          timestamp: new Date(),
          team: [selectedProfile],
        },
      ],
      timestamp: new Date(),
    });

    await collection.updateOne(
      { _id: new ObjectId(contributionId) },
      {
        $set: { threads: updatedThreads, modified_at: new Date() },
      }
    );

    return { success: true, message: "E-mail envoyé et réponse enregistrée" };
  },
  {
    response: {
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Envoi d'un e-mail",
      description:
        "Cette route permet d'envoyer un e-mail à un destinataire et d'enregistrer la réponse dans MongoDB dans une collection spécifique",
      tags: ["Envoi de mails"],
    },
  }
);

export default sendMail;
