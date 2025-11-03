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
  async ({ set, body }: { set: any; body: bodyType }) => {
    const data = { ...body, PUBLIC_API_PASSWORD: password }
    const responseId = await fetch(`${url}/et_bso_all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(`Error while updating index ${body?.index_name}`)
        return response.json()
      })
      .then((data: any) => {
        if (data.status === "success") {
          if (!data?.data?.task_id)
            throw new Error("BSO-tasks didnt return an Id!")
          return data.data.task_id
        } else throw new Error(`BSO-tasks returned status=${data.status}`)
      })
      .catch((error) => {
        throw error
      })

    return {
      id: responseId,
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
      summary: "Lancer une tâche extract_transform de BSO-publications",
      description:
        "Cette route permet de lancer un extract_transform de BSO-publications.",
      tags: ["Tâches"],
    },
  }
)

export default updateIndex
