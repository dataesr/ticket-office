import Elysia, { Static } from "elysia";
import { ObjectId } from "mongodb";

import db from "../../../libs/mongo";
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { variationSchema, variationParams } from "../../../schemas/get_id/variationSchema"
import { postVariationSchema } from "../../../schemas/post/variationSchema"
import { replyEmailConfig } from "../../../utils/configEmail"
import { sendMattermostNotification } from "../../../utils/sendMattermostNotification"

const postBsoLocalVariationsRoute = new Elysia()

postBsoLocalVariationsRoute.post(
  "/bso-local-variations/:api",
  async ({ body, params: { api }, error }) => {
    const _id = new ObjectId()
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
    }

    const collection = `bso_local_variations_${api}`
    const result = await db.collection(collection).insertOne(newVariation)

    if (!result.insertedId) {
      return error(500, { message: "Failed to create the variation" })
    }

    const finalVariation = {
      ...newVariation,
      id: result.insertedId.toHexString(),
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY
    if (!BREVO_API_KEY) {
      return error(500, { message: "BREVO_API_KEY is not defined" })
    }
    const message = `<ul><li>Nom de la structure: ${newVariation.structure.name}</li><li>Identifiant de la structure: ${
      newVariation.structure?.id || "Non renseigné"
    }</li><li>Date de la demande: ${new Date(newVariation.created_at).toLocaleDateString()}</li></ul>`
    const dataForBrevo = {
      sender: {
        email: replyEmailConfig.bso.senderEmail,
        name: replyEmailConfig.bso.senderName,
      },
      to: [{ email: finalVariation.contact.email, name: finalVariation.contact.email.split("@")[0] }],
      replyTo: {
        email: replyEmailConfig.bso.replyToEmail,
        name: replyEmailConfig.bso.replyToName,
      },
      ...(replyEmailConfig.bso.bcc && replyEmailConfig.bso.bcc.length > 0 && { bcc: replyEmailConfig.bso.bcc }),
      subject: `Réponse à votre demande de déclinaison locale, référence bso-${newVariation.id}`,
      templateId: 274,
      params: {
        date: new Date().toLocaleDateString("fr-FR"),
        message,
      },
    }
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(dataForBrevo),
    })
    if (!response.ok) {
      return error(500, {
        message: `Erreur d'envoi d'email: ${response.statusText}`,
        code: "EMAIL_SEND_FAILED",
      })
    }

    const url = process.env.BASE_API_URL
    const variationLink = `${url}/bso-local-variations/${api}?page=1&query=${finalVariation.id}&searchInMessage=false&sort=DESC&status=choose`
    const mattermostMessage = `:mega: 🚀 Bip...Bip - Nouvelle demande de déclinaison locale créée!
     \n**Email de contact**: ${finalVariation.contact.email} \n**Nom de la structure**: ${
      finalVariation.structure.name
    } \n**ID de la structure**: ${
      finalVariation.structure?.id || "non renseigné"
    } \n🔗 [Voir la contribution](${variationLink})`
    await sendMattermostNotification(mattermostMessage)

    return finalVariation as Static<typeof variationSchema>
  },
  {
    body: postVariationSchema,
    params: variationParams,
    response: {
      200: variationSchema,
      401: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Créer une nouvelle déclinaison locale",
      description: "Cette route permet de créer une nouvelle déclinaison locale.",
      tags: ["Déclinaisons locales"],
    },
  }
)

export default postBsoLocalVariationsRoute
