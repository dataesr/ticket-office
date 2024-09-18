import { MongoClient } from "mongodb";

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(mongoURI);

async function addFromAppField() {
  try {
    console.log(mongoURI);
    await client.connect();
    console.log("Connecté à MongoDB");

    const db = client.db("ticket-office-api");
    // change collection with contact / contribute_production and contribute

    const collection = db.collection("update-user-data");

    const contacts = await collection.find().toArray();
    console.log(contacts);
    console.log(`Nombre de contacts trouvés : ${contacts.length}`);

    for (const contact of contacts) {
      const updateData = {
        fromApp: "scanR",
      };

      console.log("Mise à jour pour le document :", contact._id);
      console.log("Données mises à jour :", updateData);

      await collection.updateOne(
        { _id: contact._id },
        {
          $set: updateData,
        }
      );
    }

    console.log("Migration terminée avec succès.");
  } catch (error) {
    console.error("Erreur lors de la migration :", error);
  } finally {
    await client.close();
  }
}

addFromAppField();

// node migrateFromApp.js
