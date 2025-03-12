import { MongoClient } from "mongodb";
import { config } from "./config";
import { formatDate } from "./utils";

export async function getMongoClient() {
  const client = new MongoClient(config.mongoUri);
  await client.connect();
  return client;
}

export async function lookupCorrectCollection(
  referenceId: string
): Promise<string> {
  const client = await getMongoClient();
  const collections = [
    "contacts",
    "contribute",
    "contribute_productions",
    "remove-user",
    "update-user-data",
    "local_variations",
  ];
  try {
    const database = client.db(config.dbName);

    for (const collectionName of collections) {
      const collection = database.collection(collectionName);
      const document = await collection.findOne({ id: referenceId });
      if (document) {
        console.log(
          `ID ${referenceId} trouvé dans la collection ${collectionName}`
        );
        return collectionName;
      }
    }

    console.log(
      `ID ${referenceId} non trouvé dans aucune collection, utilisation de la collection par défaut`
    );
    return "contacts";
  } catch (error) {
    console.error("Erreur lors de la recherche de la collection :", error);
    return "contacts";
  } finally {
    await client.close();
  }
}

export async function isEmailDuplicate(
  client: MongoClient,
  messageId: string,
  date: string,
  extractedContent: string
): Promise<boolean> {
  const database = client.db(config.dbName);
  const collection = database.collection("received_emails");

  const existingEmail = await collection.findOne({
    $or: [
      { messageId, date },
      { messageId, extractedText: extractedContent },
      {
        $and: [
          { extractedText: extractedContent },
          {
            date: {
              $gte: new Date(new Date(date).getTime() - 60000).toISOString(),
            },
          },
          {
            date: {
              $lte: new Date(new Date(date).getTime() + 60000).toISOString(),
            },
          },
        ],
      },
      // Même contenu, mais date différente, on considère que c'est un doublon si la date est dans les 2 dernières minutes
      // Mais c'est vraiment costaud, ça devrait être suffisant
    ],
  });

  return !!existingEmail;
}
export async function saveReceivedEmail(
  envelope: any,
  messageSource: string,
  extractedContent: string,
  date: string,
  referenceId?: string 
): Promise<boolean> {
  const client = await getMongoClient();
  try {
    const isDuplicate = await isEmailDuplicate(
      client,
      envelope.messageId,
      date,
      extractedContent
    );

    if (isDuplicate) {
      console.log(
        `Email déjà enregistré : ${envelope.messageId} à la date ${date}`
      );
      return false;
    }

    const database = client.db(config.dbName);
    const collection = database.collection("received_emails");

    const emailData = {
      messageId: envelope.messageId,
      from: envelope.from,
      to: envelope.to,
      subject: envelope.subject,
      date,
      rawContent: messageSource,
      extractedText: extractedContent,
      createdAt: new Date(),
      contributionId: referenceId || null, 
    };

    await collection.insertOne(emailData);
    console.log(
      `Email enregistré dans received_emails : ${envelope.messageId}${referenceId ? ` (contribution: ${referenceId})` : ''}`
    );
    return true;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'email :", error);
    return false;
  } finally {
    await client.close();
  }
}

export async function updateContribution(
  referenceId: string,
  responseMessage: string,
  timestamp: string | null,
  collectionName: string
) {
  const client = await getMongoClient();

  try {
    const database = client.db(config.dbName);
    const collection = database.collection(collectionName);

    const contribution = await collection.findOne({ id: referenceId });

    if (!contribution) {
      console.log(`Aucune contribution trouvée pour l'ID: ${referenceId}`);
      return;
    }

    const existingThreads = Array.isArray(contribution.threads)
      ? contribution.threads
      : [];

    const isDuplicate = existingThreads.some(
      (thread) =>
        thread.timestamp === formatDate(timestamp) &&
        thread.responses.some(
          (response: { responseMessage: string }) =>
            response.responseMessage === responseMessage
        )
    );

    if (isDuplicate) {
      console.log("Réponse déjà enregistrée, aucune mise à jour effectuée.");
      return;
    }

    const response = {
      threadId: contribution._id.toString(),
      responses: [
        {
          responseMessage,
          read: false,
          timestamp: formatDate(timestamp),
          team: ["user"],
        },
      ],
      timestamp: formatDate(timestamp),
    };

    const updateResult = await collection.updateOne(
      { _id: contribution._id },
      { $set: { threads: [...existingThreads, response] } }
    );

    if (updateResult.modifiedCount > 0) {
      console.log(`Mise à jour réussie pour l'ID de référence: ${referenceId}`);
      return contribution;
    }

    return null;
  } finally {
    await client.close();
  }
}
