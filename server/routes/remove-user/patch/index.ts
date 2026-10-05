import { Elysia, t } from "elysia"
import db from "../../../libs/mongo.js"
import { deleteSchema } from "../../../schemas/get/deleteSchema.ts.js"
import { editContributionSchema } from "../../../schemas/patch_id/editContributionSchema.js"
import { errorSchema } from "../../../schemas/errors/errorSchema.js"
import { normalizeContributionUpdate } from "../../../utils/contributionUpdate.js"

type removeUserType = typeof deleteSchema.static

const removeUserPutRoutes = new Elysia().patch(
  "/remove-user/:id",
  async ({ params: { id }, body, set }) => {
    normalizeContributionUpdate(body)

    const { acknowledged } = await db
      .collection("remove-user")
      .updateOne({ id }, { $set: { ...body, updatedAt: new Date() } })

    if (!acknowledged) {
      set.status = 500
      return { message: "Erreur interne du serveur" }
    }

    const updatedContact = await db
      .collection("remove-user")
      .findOne<removeUserType>({ id })

    if (!updatedContact) {
      set.status = 404
      return { message: "Contact non trouvé" }
    }

    const responseContact = {
      id: updatedContact.id,
      name: updatedContact.name,
      email: updatedContact.email,
      message: updatedContact.message,
      status: updatedContact.status,
      team: updatedContact.team,
      modified_at: updatedContact.modified_at,
      extra: updatedContact.extra || {},
      contributionType: updatedContact.contributionType,
    }

    return responseContact
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    body: editContributionSchema,
    response: {
      200: deleteSchema,
      401: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary:
        "Modifier une contribution sur une demande de suppression de profil par ID",
      description:
        "Cette route permet de mettre à jour une contribution spécifique via l'ID fourni.",
      tags: ["Suppression de profil"],
    },
  }
)

export default removeUserPutRoutes
