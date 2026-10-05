import { Elysia } from "elysia"
import db from "../../../libs/mongo"
import { postUpdateUserDataSchema } from "../../../schemas/post/UpdateUserDataSchema"
import { ObjectId } from "mongodb"
import { errorSchema } from "../../../schemas/errors/errorSchema"
import { updateDatasSchema } from "../../../schemas/get/updateDatasSchema"
import { emailRecipients } from "../../contacts/post/emailRecipents"
import { newContributionEmailConfig } from "../../../utils/configEmail"
import { sendMattermostNotification } from "../../../utils/sendMattermostNotification"
import { sendBrevoEmail } from "../../../utils/brevo"

type postUpdateUserDataSchemaType = typeof postUpdateUserDataSchema.static

const postUpdateUserDataRoutes = new Elysia().post(
  "/update-user-data",
  async ({ set, body }) => {
    const extraLowercase = Object.keys(body.extra || {}).reduce(
      (acc, key) => ({
        ...acc,
        [key]: body.extra ? (body.extra as any)[key].toLowerCase() : "",
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

    const result = await db
      .collection("update-user-data")
      .insertOne(newContribution)

    if (!result.insertedId) {
      set.status = 500
      return { message: "Failed to create the contribution" }
    }

    const finalContribution = {
      ...newContribution,
      id: result.insertedId.toHexString(),
    }

    const url = process.env.BASE_API_URL
    const contributionLink = `${url}/scanr-namechange?page=1&query=${finalContribution.id}&searchInMessage=false&sort=DESC&status=choose`

    const recipients = emailRecipients["update-user-data"] || {
      to: process.env.SCANR_EMAIL_RECIPIENTS?.split(",") || [],
    }
    const selectedConfig = newContributionEmailConfig.scanr

    const fonction = finalContribution.extra?.fonction || "non renseigné"
    const dataForBrevo = {
      sender: {
        email: selectedConfig.senderEmail,
        name: selectedConfig.senderName,
      },
      to: recipients.to.map((email) => ({
        email,
        name: email.split("@")[0],
      })),
      replyTo: {
        email: selectedConfig.replyToEmail,
        name: selectedConfig.replyToName,
      },
      subject: "Nouvelle demande de modification de profil",
      templateId: 268,
      params: {
        date: new Date().toLocaleDateString("fr-FR"),
        title: "Nouvelle demande de modification de profil",
        id: finalContribution.id,
        link: contributionLink,
        name: finalContribution.name,
        email: finalContribution.email,
        fonction: fonction,
        message: `${finalContribution.message}`,
      },
    }

    await sendBrevoEmail(dataForBrevo)

    const mattermostMessage = `:mega: 🚀 Bip...Bip - Nouvelle demande de mise à jour sur scanR !
          **Nom**: ${finalContribution.name}
          **Email**: ${finalContribution.email}
         🔗 [Voir la contribution](${contributionLink})`

    await sendMattermostNotification(mattermostMessage)

    return finalContribution
  },
  {
    body: postUpdateUserDataSchema,
    response: {
      200: updateDatasSchema,
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary:
        "Créer une nouvelle contribution via formulaire de demande de mise à jour de données utilisateur",
      description:
        "Cette route permet de créer une nouvelle contribution soumise via le formulaire de contact.",
      tags: ["Mise à jour de données utilisateur"],
    },
  }
)

export default postUpdateUserDataRoutes
