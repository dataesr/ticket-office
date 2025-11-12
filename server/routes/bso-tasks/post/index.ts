import { Elysia, t } from "elysia"
import { errorSchema } from "../../../schemas/errors/errorSchema"

const url = process.env.URL_UPW || ""
const password = process.env.PUBLIC_API_PASSWORD || ""

const updateIndex = new Elysia()

const bodySchema = t.Record(
  t.String(),
  t.Union([t.Boolean(), t.String(), t.Number(), t.Array(t.String())])
)
const responseSchema = t.Object({
  id: t.String(),
  params: bodySchema,
})
type bodyType = typeof bodySchema.static

updateIndex.post(
  "/bso-tasks",
  async ({ set, body }) => {
    try {
      const data = { ...body, PUBLIC_API_PASSWORD: password }
      const response = await fetch(`${url}/et_bso_all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        set.status = 500
        return { message: `Error while updating index ${body?.index_name}` }
      }

      const responseData: any = await response.json()

      if (responseData.status !== "success") {
        set.status = 500
        return { message: `BSO-tasks returned status=${responseData.status}` }
      }

      if (!responseData?.data?.task_id) {
        set.status = 500
        return { message: "BSO-tasks didnt return an Id!" }
      }

      return {
        id: responseData.data.task_id,
        params: body,
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
      summary: "Lancer une tâche extract_transform de BSO-publications",
      description:
        "Cette route permet de lancer un extract_transform de BSO-publications.",
      tags: ["Tâches"],
    },
  }
)

export default updateIndex
