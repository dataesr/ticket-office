import { MongoClient } from "mongodb";

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017";
<<<<<<< HEAD
<<<<<<< HEAD
const mongoDataBase = process.env.MONGO_DATABASE || "ticket-office";
=======
>>>>>>> 03c66cc (fix(contribute_productions): update schemas)
=======
const mongoDataBase = process.env.MONGO_DATABASE || "ticket-office";
>>>>>>> 37578c4 (fix(mongo): rename db name)
const client = new MongoClient(mongoURI);

// THIS SCRIPT IS USED TO RENAME "id" FIELD TO "objectId"
// USE IT DIRECTLY IN PROD

console.log(mongoURI);
async function renameIdToObjectId() {
  try {
    await client.connect();
    console.log("Connecté à MongoDB");

<<<<<<< HEAD
<<<<<<< HEAD
    const db = client.db(mongoDataBase);
=======
    const db = client.db("ticket-office-api");
>>>>>>> 03c66cc (fix(contribute_productions): update schemas)
=======
    const db = client.db(mongoDataBase);
>>>>>>> 37578c4 (fix(mongo): rename db name)
    // change collection if needed
    const collection = db.collection("contribute_productions");

    const contacts = await collection.find().toArray();
    console.log(`Nombre de contacts trouvés : ${contacts.length}`);

    for (const contact of contacts) {
      // Vérifie si le champ 'id' existe avant de le renommer
      if (contact.id) {
        try {
          // Renomme le champ 'id' en 'objectId'
          await collection.updateOne(
            { _id: contact._id },
            {
              $rename: { id: "objectId" },
            }
          );

          console.log(`Document mis à jour pour l'ID : ${contact._id}`);
        } catch (error) {
          console.error(
            `Impossible de renommer le champ id en objectId pour le document : ${contact._id}`,
            error
          );
        }
      }
    }

    console.log("Renommage terminé avec succès.");
  } catch (error) {
    console.error("Erreur lors du renommage :", error);
  } finally {
    await client.close();
  }
}

renameIdToObjectId();
