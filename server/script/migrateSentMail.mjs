import { MongoClient, ObjectId } from "mongodb";

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017";

const client = new MongoClient(mongoURI);

async function migrateContacts() {
  try {
    await client.connect();
    console.log("Connecté à MongoDB");

    const db = client.db("ticket-office-api");
    // change collection with contacts / contribute_production and contribute
    const collection = db.collection("contribute_productions");

    const contacts = await collection.find().toArray();
    console.log(contacts);
    console.log(`Nombre de contacts trouvés : ${contacts.length}`);

    for (const contact of contacts) {
      if (contact.mailSent && contact.mailSentDate && contact.responseFrom) {
        const updateData = {
          threads: [
            {
              threadId: new ObjectId().toString(),
              responses: [
                {
                  responseMessage: contact.mailSent,
                  timestamp: contact.mailSentDate,
                  team: contact.responseFrom ? [contact.responseFrom] : [],
                },
              ],
              timestamp: contact.mailSentDate,
            },
          ],
        };

        console.log("Mise à jour pour le document :", contact._id);
        console.log("Données mises à jour :", updateData);

        await collection.updateOne(
          { _id: contact._id },
          {
            $set: updateData,
            $unset: {
              mailSent: "",
              mailSentDate: "",
              responseFrom: "",
            },
          }
        );
      }
    }

    console.log("Migration terminée avec succès.");
  } catch (error) {
    console.error("Erreur lors de la migration :", error);
  } finally {
    await client.close();
  }
}

migrateContacts();
