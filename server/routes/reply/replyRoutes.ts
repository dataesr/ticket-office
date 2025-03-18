import { Elysia } from "elysia";
import { MongoClient, ObjectId } from "mongodb";
import { errorSchema } from "../../schemas/errors/errorSchema";
import { replyEmailConfig } from "../../utils/configEmail";
import { ReplyEmailConfig } from "../../types";

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
      "local_variations",
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
    const selectedConfig: ReplyEmailConfig =
      collectionName === "local_variations"
        ? replyEmailConfig.bso
        : replyEmailConfig.scanr;
    const dataForBrevo = {
      sender: {
        email: selectedConfig.senderEmail,
        name: `${selectedProfile} de ${
          selectedConfig.senderName.charAt(0).toLocaleLowerCase() +
          selectedConfig.senderName.slice(1)
        }`,
      },
      to: [{ email: to, name: name }],
      replyTo: {
        email: selectedConfig.replyToEmail,
        name: selectedConfig.replyToName,
      },
      // Cette ligne ajoute les destinataires en copie cachée (bcc) seulement si:
      // 1. selectedConfig.bcc existe
      // 2. C'est bien un tableau
      // 3. Le tableau contient au moins un élément
      // Si une condition n'est pas remplie, la propriété bcc n'est pas ajoutée du tout
      // Ce format utilise le spread operator (...) pour fusionner conditionnellement l'objet
      ...(selectedConfig.bcc &&
        selectedConfig.bcc.length > 0 && { bcc: selectedConfig.bcc }),
      subject: subject,
      templateId: selectedConfig.templateId,
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
      const errorText = await response.text();
      console.error("Erreur Brevo:", errorText);
      return {
        success: false,
        error: `Erreur d'envoi: ${response.statusText}`,
        details: errorText,
      };
    }

    let fromApplication = null;
    if (collectionName === "contacts") {
      const contactDoc = await db.collection("contacts").findOne({
        _id: new ObjectId(contributionId),
      });
      if (contactDoc && contactDoc.fromApplication) {
        fromApplication = contactDoc.fromApplication;
      }
    }

    const sentEmailsCollection = db.collection("sent_emails");
    await sentEmailsCollection.insertOne({
      to,
      name,
      subject,
      userResponse,
      selectedProfile,
      message,
      sentAt: new Date(),
      contributionId,
      collectionName,
      status: "sent",
      ...(fromApplication && { fromApplication }),
    });

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
      threadId: existingDoc._id.toString(),
      responses: [
        {
          responseMessage: userResponse,
          read: true,
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

    return {
      success: true,
      message:
        "E-mail envoyé, réponse enregistrée et email loggé dans sent_emails",
      collection: collectionName,
    };
  },
  {
    response: {
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Envoi d'un e-mail",
      description:
        "Cette route permet d'envoyer un e-mail à un destinataire et d'enregistrer la réponse dans MongoDB dans une collection spécifique. Elle log également les emails envoyés dans une nouvelle collection 'sent_emails'.",
      tags: ["Envoi de mails"],
    },
  }
);

export default sendMail;
