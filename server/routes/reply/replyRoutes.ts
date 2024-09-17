import { Elysia, Static } from "elysia";
import { MongoClient, ObjectId } from "mongodb";
import { sendEmailViaBrevo } from "../../utils/emailUtils";
import { validateQueryParams } from "../../utils/queryValidator";
import { postReplyToContributionSchema } from "../../schemas/post/replyToContribution";

type PostReplyToContributionSchema = Static<
  typeof postReplyToContributionSchema
>;

const replyRoutes = new Elysia();
const MONGO_URI = process.env.MONGO_URI || "";

const client = new MongoClient(MONGO_URI);
await client.connect();
const db = client.db("mydatabase");

replyRoutes.post(
  "/reply-to-contribution",
  async ({ query, error, body }: { query: any; error: any; body: any }) => {
    if (!validateQueryParams(query)) {
      console.log("Paramètres de requête invalides:", query);
      return error(422, "Invalid query parameters");
    }

    const contactData: PostReplyToContributionSchema = body;
    const { contributionId, responseMessage } = contactData;

    let collectionName: string | undefined;
    let contribution: any;

    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      const colName = collection.name;
      const col = db.collection(colName);
      contribution = await col.findOne({ _id: new ObjectId(contributionId) });
      if (contribution) {
        collectionName = colName;
        break;
      }
    }

    if (!contribution) {
      return error(400, "Contribution non trouvée");
    }

    if (!collectionName) {
      return error(500, "Nom de la collection non trouvé");
    }
    console.log(collectionName);
    const targetCollection = db.collection(collectionName);

    const emailSent = await sendEmailViaBrevo(
      contribution.email,
      "Réponse à votre contribution",
      responseMessage
    );

    if (!emailSent) {
      return error(500, "Échec de l'envoi de l'email");
    }

    const threadUpdate = {
      threadId: new ObjectId().toString(),
      originalMessage: contribution.message,
      responses: [
        {
          responseMessage,
          timestamp: new Date(),
          team: contribution.team,
        },
      ],
      timestamp: new Date(),
    };

    const updatedThreads = [...(contribution.threads || []), threadUpdate];
    const updateResult = await targetCollection.updateOne(
      { _id: new ObjectId(contributionId) },
      {
        $set: { threads: updatedThreads },
      }
    );

    if (!updateResult.modifiedCount) {
      console.log("Échec de la mise à jour de la contribution.");
      return error(500, "Échec de la mise à jour de la contribution");
    }

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
    },
  }
);

export default replyRoutes;
