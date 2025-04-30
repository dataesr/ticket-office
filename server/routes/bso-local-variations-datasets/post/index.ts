import Elysia, { Static } from "elysia";
import { ObjectId } from "mongodb";

import db from "../../../libs/mongo";
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { variationSchema } from "../../../schemas/get_id/variationSchema";
import { postVariationSchema } from "../../../schemas/post/variationSchema";
import { replyEmailConfig } from "../../../utils/configEmail";
import { sendMattermostNotification } from "../../../utils/sendMattermostNotification";

type postVariationSchemaType = Static<typeof postVariationSchema>;

const postBsoLocalVariationsDatasetsRoute = new Elysia();

postBsoLocalVariationsDatasetsRoute.post(
  "/bso-local-variations-datasets",
  async ({ error, body }: { error: any; body: postVariationSchemaType }) => {
    const _id = new ObjectId();
    const newVariation = {
      ...body,
      csv: atob(body?.csv),
      _id,
      id: _id.toHexString(),
      created_at: new Date(),
      status: "new",
      tags: {
        file: "none",
        notification: "none",
      },
    };

    const result = await db
      .collection("bso_local_variations_datasets")
      .insertOne(newVariation);

    if (!result.insertedId) {
      return error(500, "Failed to create the variation");
    }

    const finalVariation = {
      ...newVariation,
      id: result.insertedId.toHexString(),
    };

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) {
      return {
        success: false,
        error: "BREVO_API_KEY is not defined",
      };
    };
    const dataForBrevo = {
      sender: { email: finalVariation.contact.email, name: replyEmailConfig.bso.senderName },
      to: [{ email: finalVariation.contact.email, name: finalVariation.contact.email.split("@")[0] }],
      replyTo: { email: replyEmailConfig.bso.replyToEmail, name: replyEmailConfig.bso.replyToName },
      ...(replyEmailConfig.bso.bcc &&
        replyEmailConfig.bso.bcc.length > 0 && { bcc: replyEmailConfig.bso.bcc }),
      subject: "[BSO] Merci pour votre demande",
      templateId: 273,
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
      return error(500, {
        message: `Erreur d'envoi d'email: ${response.statusText}`,
        code: "EMAIL_SEND_FAILED",
      });
    }

    const url = process.env.BASE_API_URL;
    const variationLink = `${url}/bso-local-variations-datasets?page=1&query=${finalVariation.id}&searchInMessage=false&sort=DESC&status=choose`;
    const mattermostMessage = `:mega: 🚀 Bip...Bip - Nouvelle demande de déclinaison locale créée!
     \n**Email de contact**: ${finalVariation.contact.email
      } \n**Nom de la structure**: ${finalVariation.structure.name
      } \n**ID de la structure**: ${finalVariation.structure?.id || "non renseigné"
      } \n🔗 [Voir la contribution](${variationLink})`;
    await sendMattermostNotification(mattermostMessage);

    return finalVariation;
  },
  {
    body: postVariationSchema,
    response: {
      200: variationSchema,
      401: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Créer une nouvelle déclinaison locale",
      description:
        "Cette route permet de créer une nouvelle déclinaison locale.",
      tags: ["Déclinaisons locales"],
    },
  }
);

export default postBsoLocalVariationsDatasetsRoute;
