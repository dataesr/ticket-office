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
  "/reply-to-contribution",
  async ({ body, set }: { body: any; set: any }) => {
    try {
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
        "bso_local_variations_publications",
        "bso_local_variations_datasets",
      ];

      if (!allowedCollections.includes(collectionName)) {
        set.status = 400;
        return {
          success: false,
          error: `La collection ${collectionName} n'est pas autorisée.`,
        };
      }

      const BREVO_API_KEY = process.env.BREVO_API_KEY;
      if (!BREVO_API_KEY) {
        set.status = 500;
        return {
          success: false,
          error: "BREVO_API_KEY is not defined",
        };
      }

      const selectedConfig: ReplyEmailConfig = [
        "bso_local_variations_publications",
        "bso_local_variations_datasets",
      ].includes(collectionName)
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
        set.status = 500;
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
        set.status = 404;
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
    } catch (error) {
      set.status = 500;
      return {
        success: false,
        error: "Error processing request",
      };
    }
  },
  {
    response: {
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Répondre à une contribution",
      description:
        "Envoie un e-mail de réponse à un contributeur via Brevo, enregistre la réponse dans le thread de la contribution MongoDB et log l'email dans la collection 'sent_emails'.",
      tags: ["Envoi de mails"],
      responses: {
        200: {
          description: "E-mail envoyé et contribution mise à jour",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example:
                      "E-mail envoyé, réponse enregistrée et email loggé dans sent_emails",
                  },
                  collection: { type: "string", example: "contacts" },
                },
              },
            },
          },
        },
        400: {
          description: "Collection non autorisée",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  error: { type: "string" },
                },
              },
            },
          },
        },
        404: {
          description: "Contribution introuvable",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  error: { type: "string", example: "Document not found" },
                },
              },
            },
          },
        },
        500: {
          description: "Erreur serveur",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  error: { type: "string" },
                  details: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  }
);

export default sendMail;
