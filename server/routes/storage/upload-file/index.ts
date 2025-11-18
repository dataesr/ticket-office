import { Elysia, t } from "elysia"
import { errorSchema } from "../../../schemas/errors/errorSchema"
import Storage from "../../../libs/storage"

const uploadFileRoute = new Elysia()

const bodySchema = t.Object(
  {
    buffer: t.Any(),
    filename: t.String(),
    container: t.String(),
    mimetype: t.Enum({
      text: "text/plain",
      csv: "text/csv",
      json: "application/json",
    }),
  },
  { additionalProperties: false }
)
const responseSchema = t.Object({
  name: t.String(),
  etag: t.String(),
  size: t.Number(),
  lastModified: t.Union([t.Date(), t.String()]),
  container: t.String(),
})

uploadFileRoute.post(
  "/storage",
  async ({ set, body }) => {
    try {
      const { buffer, container, filename, mimetype } = body
      const response = await Storage.put(buffer, container, filename, {
        contentType: mimetype,
      })

      if (!response?.name && !response?.size) {
        set.status = 500
        return { message: "Failed to upload the file" }
      }

      return {
        name: response.name,
        etag: response.etag,
        size: response.size,
        lastModified: response.lastModified,
        container: response.container,
      }
    } catch (error) {
      set.status = 500
      return { message: "Error processing request" }
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
      description:
        "Cette route retourne permet de charger un fichier dans Object Storage via son container et son nom.",
      tags: ["Object storage"],
    },
  }
)

export default uploadFileRoute
