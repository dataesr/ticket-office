import Elysia, { NotFoundError, t } from "elysia"
import { errorSchema } from "../../../schemas/errors/errorSchema"
import Storage from "../../../libs/storage"

const getFileRoute = new Elysia()

export const responseSchema = t.Object(
  {
    fileContent: t.String(),
  },
  { additionalProperties: true }
)

getFileRoute.get(
  "/storage/:container/:filename",
  async ({ params: { container, filename } }) => {
    const response = (await Storage.get(container, filename).catch((err) => {
      if (err.statusCode === 404) throw new NotFoundError()
      return err.message
    })) as string

    return {
      fileContent: response || "",
    }
  },
  {
    response: {
      200: responseSchema,
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Obtenir un fichier depuis Object Storage",
      description: "Cette route retourne les détails d'un fichier spécifique via le container et le nom fourni.",
      tags: ["Object storage"],
    },
  }
)

export default getFileRoute
