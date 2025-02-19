import Elysia, { Static, t } from "elysia"
import { errorSchema } from "../../../schemas/errors/errorSchema"
import { responseSchema } from "../get-file"
import Storage from "../../../libs/storage"

const uploadFileRoute = new Elysia()

const bodySchema = t.Object(
  {
    buffer: t.Any(),
    filename: t.String(),
    container: t.String(),
    mimetype: t.Enum({ text: "text/plain", csv: "text/csv", json: "application/json" }),
  },
  { additionalProperties: false }
)
type bodyType = Static<typeof bodySchema>

uploadFileRoute.post(
  "/storage",
  async ({ error, body }: { error: any; body: bodyType }) => {
    const { buffer, container, filename, mimetype } = body
    const response = await Storage.put(buffer, container, filename, {
      contentType: mimetype,
    })

    if (!response?.name && !response?.size) return error(500, "Failed to upload the file")

    return {
      name: response.name,
      etag: response.etag,
      size: response.size,
      lastModified: response.lastModified,
      container: response.container,
    }
  },
  {
    body: bodySchema,
    response: {
      200: responseSchema,
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Charger un fichier dans Object Storage",
      description: "Cette route retourne permet de charger un fichier dans Object Storage via son container et son nom.",
      tags: ["Object storage"],
    },
  }
)

export default uploadFileRoute
