import Elysia, { t } from "elysia"
import { errorSchema } from "../../../schemas/errors/errorSchema"
import Storage from "../../../libs/storage-bso-local"

const getStorage = new Elysia()

getStorage.post(
  "/storage",
  async ({ error, body }: { error: any; body: any }) => {
    const response = (await Storage.put(body.file.buffer, body.file.name, { contentType: body.file.mimetype })) as string
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
