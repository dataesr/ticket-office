import { dot } from "dot-object"
import Elysia, { Static, t } from "elysia"

import db from "../../../libs/mongo"
import { errorSchema } from "../../../schemas/errors/errorSchema"
import { variationSchema } from "../../../schemas/get_id/variationSchema"
import { editVariationSchema } from "../../../schemas/patch_id/editVariationSchema"

type variationType = Static<typeof variationSchema>
const patchBsoLocalVariationsDatasetsByIdRoute = new Elysia()

patchBsoLocalVariationsDatasetsByIdRoute.patch(
  "/bso-local-variations-datasets/:id",
  async ({ params: { id }, body, error }) => {
    if (body?.status === "treated") {
      body.treated_at = new Date()
    }

    const { acknowledged } = await db
      .collection("bso_local_variations_datasets")
      .updateOne({ id }, { $set: { ...dot(body), modified_at: new Date() } })

    if (!acknowledged) {
      return error(500, { message: "Erreur interne du serveur" })
    }

    const updatedVariation = await db.collection("bso_local_variations_datasets").findOne<variationType>({ id })
    if (!updatedVariation) {
      return error(404, { message: "Déclinaison locale non trouvée" })
    }

    return updatedVariation
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    body: editVariationSchema,
    response: {
      200: variationSchema,
      401: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Modifier une déclinaison locale via son ID",
      description:
        "Cette route permet de mettre à jour une déclinaison locale spécifique via l'ID fourni. Elle permet de modifier le statut, d'ajouter la personne modifiant dans l'équipe, et de mettre à jour la date de traitement et de modification.",
      tags: ["Déclinaisons locales"],
    },
  }
)

export default patchBsoLocalVariationsDatasetsByIdRoute;
