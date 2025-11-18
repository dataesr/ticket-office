import { Elysia, t } from "elysia"
import db from "../../../libs/mongo"
import { errorSchema } from "../../../schemas/errors/errorSchema"
import { updateDatasSchema } from "../../../schemas/get/updateDatasSchema"
import { editContributionSchema } from "../../../schemas/patch_id/editContributionSchema"

type updateUserDataType = typeof updateDatasSchema.static

const updateUserDataPutRoutes = new Elysia().patch(
  "/update-user-data/:id",
  async ({ params: { id }, body, set }) => {
    try {
      if (body.status && ["ongoing", "treated"].includes(body.status)) {
        body.treated_at = new Date()
      }

      if (body.team && Array.isArray(body.team)) {
        const userWhoModified = body.team[0]
        if (!body.team.includes(userWhoModified)) {
          body.team.push(userWhoModified)
        }
      }

      if (body.threads) {
        body.threads = body.threads.map(
          (thread: {
            responses?: any[]
            threadId: string
            timestamp?: string | Date | null
            message?: string
          }) => {
            thread.responses = thread.responses?.map((response) => {
              if (response.read === false) {
                response.read = true
              }
              return response
            })
            return thread
          }
        )
      }

      const { acknowledged } = await db
        .collection("update-user-data")
        .updateOne({ id }, { $set: { ...body, updatedAt: new Date() } })

      if (!acknowledged) {
        set.status = 500
        return { message: "Erreur interne du serveur" }
      }

      const updatedContact = await db
        .collection("update-user-data")
        .findOne<updateUserDataType>({ id })

      if (!updatedContact) {
        set.status = 404
        return { message: "Contact non trouvé" }
      }

      const responseContact = {
        id: updatedContact.id,
        name: updatedContact.name,
        message: updatedContact.message,
        email: updatedContact.email,
        status: updatedContact.status,
        team: updatedContact.team,
        extra: updatedContact.extra || {},
        modified_at: updatedContact.modified_at,
        contributionType: updatedContact.contributionType,
      }

      return responseContact
    } catch (error) {
      set.status = 500
      return { message: "Error processing request" }
    }
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    body: editContributionSchema,
    response: {
      200: updateDatasSchema,
      401: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary:
        "Modifier une contribution via formulaire de mise à jour de donnée par ID",
      description:
        "Cette route permet de mettre à jour une contribution spécifique via l'ID fourni.",
      tags: ["Mise à jour de données utilisateur"],
    },
  }
)

export default updateUserDataPutRoutes
