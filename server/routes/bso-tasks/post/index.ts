import Elysia, { Static, t } from "elysia"
import { errorSchema } from "../../../schemas/errors/errorSchema"

const url = process.env.URL_UPW || ""
const password = process.env.PUBLIC_API_PASSWORD || ""

const updateIndex = new Elysia()

const bodySchema = t.Record(t.String(), t.Union([t.Boolean(), t.String(), t.Number(), t.Array(t.String())]))
const responseSchema = t.Object({
  chunks: t.Number(),
  ids: t.Array(t.String()),
  params: bodySchema,
})
type bodyType = Static<typeof bodySchema>

updateIndex.post(
  "/bso-tasks",
  async ({ error, body }: { error: any; body: bodyType }) => {
    const chunks = Array.from({ length: 9 }, (_, i) => 0 + i)
    const createdIds: Array<string> = []
    Promise.all(
      chunks.map((idx) => {
        const data = { ...body, split_idx: idx, PUBLIC_API_PASSWORD: password }
        fetch(`${url}/et`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (!response.ok) throw new Error(`Error while updating index ${body?.index_name} (chunk ${idx})`)
            return response.json()
          })
          .then((data) => {
            if (data.status === "success" && data?.data?.task_status) createdIds.push(data.data.task_status)
            else throw new Error(`BSO returned status=${data.status}`)
          })
          .catch((error) => {
            throw error
          })
      })
    )
      .then(() => console.log("success"))
      .catch((error) => {
        throw error
      })

    return {
      chunks: chunks.length,
      ids: createdIds,
      params: body,
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

export default updateIndex
