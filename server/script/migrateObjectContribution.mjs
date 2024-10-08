import { MongoClient, ObjectId } from "mongodb";

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017";
const mongoDataBase = process.env.MONGO_DATABASE || "ticket-office";

const client = new MongoClient(mongoURI);

async function migrateObjectContribution() {
  try {
    await client.connect();
    console.log("Connecté à MongoDB");

    const db = client.db(mongoDataBase);
    const collection = db.collection("contribute");

    const contributions = await collection.find().toArray();
    console.log(`Nombre de contacts trouvés : ${contributions.length}`);

    for (const contribution of contributions) {
      const transformedContribution = transformFields(contribution);

      console.log("Contribution transformée :", transformedContribution);

      const updateData = {
        threads: [
          {
            threadId: new ObjectId().toString(),
            responses: [
              {
                responseMessage: transformedContribution.mailSent,
                timestamp: transformedContribution.mailSentDate,
                team: transformedContribution.responseFrom
                  ? [transformedContribution.responseFrom]
                  : [],
              },
            ],
            timestamp: transformedContribution.mailSentDate,
          },
        ],
      };

      console.log(
        "Mise à jour pour le document :",
        transformedContribution._id
      );
      console.log("Données mises à jour :", updateData);

      const result = await collection.updateOne(
        { _id: contribution._id },
        {
          $set: {
            ...updateData,
            objectId: transformedContribution.objectId,
            objectType: transformedContribution.objectType,
          },
          $unset: {
            mailSent: "",
            mailSentDate: "",
            responseFrom: "",
            id: "",
            type: "",
          },
        }
      );

      console.log(`Documents modifiés: ${result.modifiedCount}`);
    }

    console.log("Migration terminée avec succès.");
  } catch (error) {
    console.error("Erreur lors de la migration :", error);
  } finally {
    await client.close();
  }
}

function transformFields(data) {
  if (Array.isArray(data)) {
    return data.map(transformFields);
  } else if (typeof data === "object" && data !== null) {
    const transformedData = { ...data };
    for (const key in data) {
      if (key === "id") {
        transformedData["objectId"] = data[key];
        delete transformedData[key];
      } else if (key === "type") {
        transformedData["objectType"] = data[key];
        delete transformedData[key];
      }
    }
    return transformedData;
  }
  return data;
}

migrateObjectContribution();
