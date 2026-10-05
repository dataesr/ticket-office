import { Elysia } from "elysia"
import db from "../../../libs/mongo"
import { postProductionsSchema } from "../../../schemas/post/productionsSchema"
import { productionSchema } from "../../../schemas/get/productionSchema"
import { errorSchema } from "../../../schemas/errors/errorSchema"
import { ObjectId } from "mongodb"
import { emailRecipients } from "../../contacts/post/emailRecipents"
import { newContributionEmailConfig } from "../../../utils/configEmail"
import { sendMattermostNotification } from "../../../utils/sendMattermostNotification"
import { sendBrevoEmail } from "../../../utils/brevo"

type postProductionSchemaType = typeof postProductionsSchema.static

const postProductionRoutes = new Elysia().post(
  "/production",
  async ({ set, body }: { set: any; body: postProductionSchemaType }) => {
    const extraLowercase = Object.keys(body.extra || {}).reduce(
      (acc, key) => ({
        ...acc,
        [key]: body.extra ? body.extra[key].toLowerCase() : "",
      }),
      {}
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
      .collection("contribute_productions")
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
    const contributionLink = `${url}/scanr-apioperations?page=1&query=${finalContribution.id}&searchInMessage=false&sort=DESC&status=choose`

    const recipients = emailRecipients["contribute_productions"] || {
      to: process.env.SCANR_EMAIL_RECIPIENTS?.split(",") || [],
    }

    const selectedConfig = newContributionEmailConfig.scanr

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
      subject: "Nouvelle contribution d'affiliation de publication",
      templateId: 268,
      params: {
        date: new Date().toLocaleDateString("fr-FR"),
        title:
          "Nouvelle contribution créée pour une affiliation de publication(s)",
        link: contributionLink,
        message: `La contribution avec l'ID ${finalContribution.id} a été ajoutée.`,
      },
    }

    await sendBrevoEmail(dataForBrevo)

    const mattermostMessage = `:mega: 🚀 Bip...Bip - Nouvelle demande de liaison de publications créée pour scanR
      **Nom de l'auteur**: ${finalContribution.name}
      **Email du demandeur**: ${finalContribution.email}
      🔗 [Voir la contribution](${contributionLink})`

    await sendMattermostNotification(mattermostMessage)

    return finalContribution
  },
  {
    body: postProductionsSchema,
    response: {
      200: productionSchema,
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary:
        "Créer une nouvelle contribution via formulaire de liaison de productions",
      description:
        "Cette route permet de créer une nouvelle contribution soumise via le formulaire de contact.",
      tags: ["Production"],
    },
  }
)

export default postProductionRoutes
