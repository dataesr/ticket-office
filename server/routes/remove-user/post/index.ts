import { Elysia } from "elysia"
import db from "../../../libs/mongo"
import { postRemoveUserSchema } from "../../../schemas/post/removeUserSchema"
import { ObjectId } from "mongodb"
import { errorSchema } from "../../../schemas/errors/errorSchema"
import { deleteSchema } from "../../../schemas/get/deleteSchema.ts"
import { emailRecipients } from "../../contacts/post/emailRecipents"
import { newContributionEmailConfig } from "../../../utils/configEmail"
import { sendMattermostNotification } from "../../../utils/sendMattermostNotification"

type postRemoveUserSchemaType = typeof postRemoveUserSchema.static

const postRemoveUserRoutes = new Elysia().post(
  "/remove-user",
  async ({ set, body }: { set: any; body: postRemoveUserSchemaType }) => {
    const extraLowercase = Object.keys(body.extra || {}).reduce(
      (acc, key) => ({
        ...acc,
        [key]: body.extra ? body.extra[key].toLowerCase() : "",
      }),
      {} as { [key: string]: string }
    )

    const _id = new ObjectId()
    const newContribution = {
      ...body,
      _id,
      extra: extraLowercase,
      id: _id.toHexString(),
      created_at: new Date(),
      status: "new",
    }

    const result = await db.collection("remove-user").insertOne(newContribution)

    if (!result.insertedId) {
      set.status = 500
      return {
        message: "Failed to create the contribution",
        code: "INSERTION_FAILED",
      }
    }

    const finalContribution = {
      ...newContribution,
      id: result.insertedId.toHexString(),
    }

    const url = process.env.BASE_API_URL
    const contributionLink = `${url}/scanr-removeuser?page=1&query=${finalContribution.id}&searchInMessage=false&sort=DESC&status=choose`

    const BREVO_API_KEY = process.env.BREVO_API_KEY
    if (!BREVO_API_KEY) {
      set.status = 500
      return {
        message: "BREVO_API_KEY is not defined",
        code: "MISSING_API_KEY",
      }
    }

    const recipients = emailRecipients["remove-user"] || {
      to: process.env.SCANR_EMAIL_RECIPIENTS?.split(",") || [],
    }
    const selectedConfig = newContributionEmailConfig.scanr

    const fonction = finalContribution.extra?.fonction || "non renseigné"
    const dataForBrevo = {
      sender: {
        email: selectedConfig.senderEmail,
        name: selectedConfig.senderName,
      },
      to: recipients.to.map((email) => ({ email, name: email.split("@")[0] })),
      replyTo: {
        email: selectedConfig.replyToEmail,
        name: selectedConfig.replyToName,
      },
      subject: "Nouvelle demande de suppression de profil",
      templateId: 268,
      params: {
        date: new Date().toLocaleDateString("fr-FR"),
        title: "Nouvelle demande de suppression de profil",
        id: finalContribution.id,
        link: contributionLink,
        name: finalContribution.name,
        email: finalContribution.email,
        fonction: fonction,
        message: `${finalContribution.message}`,
      },
    }

    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY,
        },
        body: JSON.stringify(dataForBrevo),
      })

      if (!response.ok) {
        set.status = 500
        return {
          message: `Erreur d'envoi d'email: ${response.statusText}`,
          code: "EMAIL_SEND_FAILED",
        }
      }
    } catch (error) {
      set.status = 500
      return {
        message: `Erreur d'envoi d'email: ${error}`,
        code: "EMAIL_SEND_FAILED",
      }
    }

    try {
      const mattermostMessage = `:mega: 🚀 Bip...Bip - Nouvelle demande de suppression de profil sur scanR !*  
        **Nom**: ${finalContribution.name}  
        **Email**: ${finalContribution.email}  
       🔗 [Voir la contribution](${contributionLink})`

      await sendMattermostNotification(mattermostMessage)
    } catch (error) {
      console.error("Erreur Mattermost:", error)
    }

    return finalContribution
  },
  {
    body: postRemoveUserSchema,
    response: {
      200: deleteSchema,
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Créer une nouvelle demande de suppression de profil",
      description:
        "Cette route permet de créer une nouvelle contribution soumise via le formulaire de contact.",
      tags: ["Suppression de profil"],
    },
  }
)

export default postRemoveUserRoutes
