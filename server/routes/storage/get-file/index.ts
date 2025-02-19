import Elysia, { NotFoundError, t } from "elysia"
import { errorSchema } from "../../../schemas/errors/errorSchema"
import Storage from "../../../libs/storage-bso-local"

const getStorage = new Elysia()

getStorage.get(
  "/storage/:fileName",
  async ({ params: { fileName } }) => {
    const response = (await Storage.get(fileName).catch((err) => {
      if (err.statusCode === 404) throw new NotFoundError()
      return err.message
    })) as string
    return response
  },
  {
    response: {
      200: t.String(),
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Obtenir un fichier depuis Object Storage via son nom",
      description: "Cette route retourne les détails d'un fichier spécifique via le nom fourni.",
      tags: ["Object storage"],
    },
  }
)

export default getStorage
