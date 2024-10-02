<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
        email: "support@scanr.fr",
<<<<<<< HEAD
        name: `${selectedProfile} de l'équipe scanR`,
      },
      to: [{ email: to, name: name }],
      replyTo: { email: "support@scanr.fr", name: "L'équipe scanR" },
      subject: subject,
      templateId: 267,
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
      message: "E-mail envoyé et réponse enregistrée",
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
        "Cette route permet d'envoyer un e-mail à un destinataire et d'enregistrer la réponse dans MongoDB dans une collection spécifique",
      tags: ["Envoi de mails"],
=======
import { Elysia, Static } from "elysia";
import { MongoClient, ObjectId } from "mongodb";
import { sendEmailViaBrevo } from "../../utils/emailUtils";
import { validateQueryParams } from "../../utils/queryValidator";
import { postReplyToContributionSchema } from "../../schemas/post/replyToContribution";
=======
// import { Elysia, Static } from "elysia";
// import { MongoClient, ObjectId } from "mongodb";
// import { sendEmailViaBrevo } from "../../utils/emailUtils";
// import { validateQueryParams } from "../../utils/queryValidator";
// import { postReplyToContributionSchema } from "../../schemas/post/replyToContribution";
>>>>>>> 1d32145 (fix(collectionName): delete collectionName fields)
=======
import { Elysia } from "elysia";
import { MongoClient, ObjectId } from "mongodb";
import { errorSchema } from "../../schemas/errors/errorSchema";
>>>>>>> abc94ae (fix(send-mail): add send mail route to ui)

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
=======
>>>>>>> ca679c1 (feat(imap-server): add imap server)
        name: `${selectedProfile} de l'équipe scanR`,
      },
      to: [{ email: to, name: name }],
      replyTo: { email: "support@scanr.fr", name: "L'équipe scanR" },
      subject: subject,
      templateId: 267,
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
      message: "E-mail envoyé et réponse enregistrée",
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
        "Cette route permet d'envoyer un e-mail à un destinataire et d'enregistrer la réponse dans MongoDB dans une collection spécifique",
      tags: ["Envoi de mails"],
    },
  }
);

<<<<<<< HEAD
//     return {
//       status: 200,
//       body: { message: "Réponse envoyée avec succès" },
//     };
//   },
//   {
//     body: postReplyToContributionSchema,
//     detail: {
//       summary: "Répondre à une contribution",
//       description:
//         "Cette route permet de répondre à un utilisateur par mail suite à une contribution",
//       tags: ["Répondre à un utilisateur"],
//     },
//   }
// );

<<<<<<< HEAD
    return {
      status: 200,
      body: { message: "Réponse envoyée avec succès" },
    };
  },
  {
    body: postReplyToContributionSchema,
    detail: {
      summary: "Répondre à une contribution",
      description:
        "Cette route permet de répondre à un utilisateur par mail suite à une contribution",
      tags: ["Répondre à un utilisateur"],
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
    },
  }
);

<<<<<<< HEAD
export default sendMail;
=======
export default replyRoutes;
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
// export default replyRoutes;
>>>>>>> 1d32145 (fix(collectionName): delete collectionName fields)
=======
export default sendMail;
>>>>>>> abc94ae (fix(send-mail): add send mail route to ui)
