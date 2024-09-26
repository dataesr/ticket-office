import { MongoClient } from "mongodb";

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(mongoURI);

// THIS SCRIPT IS USED TO ADD A FIELD TO ALL DOCUMENTS IN THE CONTACTS COLLECTION
// THE FIELD IS CALLED "fromApplication" AND ITS VALUE IS "scanr"
// USE IT DIRECTLY WE PROD

async function addFromAppField() {
  try {
    await client.connect();
    console.log("Connecté à MongoDB");

    const db = client.db("ticket-office-api");
    // change collection with contact / contribute_production and contribute
    const collection = db.collection("contribute_productions");

    const contacts = await collection.find().toArray();
    console.log(`Nombre de contacts trouvés : ${contacts.length}`);

    for (const contact of contacts) {
      const updateData = {
        fromApplication: "scanr",
        id: contact._id.toString(),
      };

      const extraData = {};

      if (contact.idref) {
        extraData.idref = contact.idref;
      }
      if (contact.fonction) {
        extraData.fonction = contact.fonction;
      }
      if (contact.organisation) {
        extraData.organisation = contact.organisation;
      }

      if (Object.keys(extraData).length > 0) {
        updateData.extra = extraData;
      }

      console.log("Mise à jour pour le document :", contact._id);
      console.log("Données mises à jour :", updateData);

      await collection.updateOne(
        { _id: contact._id },
        {
          $set: updateData,
          $unset: {
            fromApp: "",
            idref: "",
            fonction: "",
            organisation: "",
          },
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
