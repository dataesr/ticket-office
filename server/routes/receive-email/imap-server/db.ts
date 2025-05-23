import { MongoClient } from "mongodb";
import { config } from "./config";
import { formatDate } from "./utils";
import { generateContributionLink } from "./utils";

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
    "bso_local_variations_publications",
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
    ],
  });

  return !!existingEmail;
}

export async function saveReceivedEmail(
  envelope: any,
  messageSource: string,
  extractedContent: {
    text: string;
    images: Record<string, { contentType: string; base64: string }>;
  },
  date: string,
  referenceId?: string,
  collectionName?: string,
  fromApplication?: string
): Promise<boolean> {
  const client = await getMongoClient();
  try {
    const isDuplicate = await isEmailDuplicate(
      client,
      envelope.messageId,
      date,
      extractedContent.text
    );

    if (isDuplicate) {
      console.log(
        `Email déjà enregistré : ${envelope.messageId} à la date ${date}`
      );
      return false;
    }

    const database = client.db(config.dbName);
    const collection = database.collection("received_emails");

    let href = null;
    if (referenceId && collectionName) {
      href = generateContributionLink(
        referenceId,
        fromApplication || "",
        collectionName
      );
    }

    const emailData = {
      messageId: envelope.messageId,
      from: envelope.from,
      to: envelope.to,
      subject: envelope.subject,
      date,
      rawContent: messageSource,
      extractedText: extractedContent.text,
      images: extractedContent.images,
      createdAt: new Date(),
      href: href,
      referenceId: referenceId || null,
      collectionName: collectionName || null,
      fromApplication: fromApplication || null,
    };

    await collection.insertOne(emailData);

    const imageCount = Object.keys(extractedContent.images).length;
    console.log(
      `Email enregistré : ${envelope.messageId}${
        referenceId ? ` (contribution: ${referenceId})` : ""
      }${imageCount > 0 ? ` avec ${imageCount} pièces jointes` : ""}`
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
  responseContent: {
    text: string;
    images: Record<string, { contentType: string; base64: string }>;
  },
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
            response.responseMessage === responseContent.text
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
          responseMessage: responseContent.text,
          attachments: responseContent.images,
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
      const imageCount = Object.keys(responseContent.images).length;
      console.log(
        `Mise à jour réussie pour l'ID de référence: ${referenceId}${
          imageCount > 0 ? ` avec ${imageCount} pièces jointes` : ""
        }`
      );
      return contribution;
    }

    return null;
  } finally {
    await client.close();
  }
}
