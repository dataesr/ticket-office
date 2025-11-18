import { Elysia, t } from "elysia"
import db from "../../../libs/mongo"
import { editContributionSchema } from "../../../schemas/patch_id/editContributionSchema"
import { contactSchema } from "../../../schemas/get/contactSchema"
import { errorSchema } from "../../../schemas/errors/errorSchema"

type ContactType = typeof contactSchema.static

const contactPutRoutes = new Elysia().patch(
  "/contacts/:id",
  async ({ params, body, set }) => {
    try {
      const { id } = params

      const updateData = { ...body }

      if (
        updateData.status &&
        ["ongoing", "treated"].includes(updateData.status)
      ) {
        updateData.treated_at = new Date()
      }

      if (updateData.team && Array.isArray(updateData.team)) {
        const userWhoModified = updateData.team[0]
        if (!updateData.team.includes(userWhoModified)) {
          updateData.team.push(userWhoModified)
        }
      }

      if (updateData.threads) {
        updateData.threads = updateData.threads.map((thread) => {
          if (thread.responses) {
            thread.responses = thread.responses.map((response) => {
              if (response.read === false) {
                response.read = true
              }
              return response
            })
          }
          return thread
        })
      }

      const { acknowledged } = await db
        .collection("contacts")
        .updateOne({ id }, { $set: { ...updateData, updatedAt: new Date() } })

      if (!acknowledged) {
        set.status = 500
        return { message: "Erreur interne du serveur" }
      }

      const updatedContact = await db
        .collection("contacts")
        .findOne<ContactType>({ id })

      if (!updatedContact) {
        set.status = 404
        return { message: "Contact non trouvé" }
      }

      return {
        id: updatedContact.id,
        fromApplication: updatedContact.fromApplication,
        name: updatedContact.name,
        email: updatedContact.email,
        status: updatedContact.status,
        team: updatedContact.team,
        modified_at: updatedContact.modified_at,
        extra: updatedContact.extra || {},
        contributionType: updatedContact.contributionType,
      }
    } catch (err) {
      console.error("Error updating contact:", err)
      set.status = 500
      return { message: "Erreur interne du serveur" }
    }
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    body: editContributionSchema,
    response: {
      200: contactSchema,
      401: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Modifier une contribution via formulaire de contact par ID",
      description:
        "Cette route permet de mettre à jour une contribution spécifique via l'ID fourni. Elle permet de modifier le statut, d'ajouter la personne modifiant dans l'équipe, et de mettre à jour la date de traitement et de modification.",
      tags: ["Contacts"],
    },
  }
)

export default contactPutRoutes
