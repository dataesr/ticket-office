import Elysia, { NotFoundError, t } from "elysia"
import { errorSchema } from "../../../schemas/errors/errorSchema"

const url = process.env.URL_UPW
const getTaskStatus = new Elysia()

getTaskStatus.get(
  "/bso-tasks/:id",
  async ({ params: { id } }) => {
    const data = await fetch(`${url}/tasks/${id}`)
      .then((response) => {
        if (response.ok) return response.json()
        else throw new Error("Failed to fetch bso-task")
      })
      .then((data) => {
        if (data.status === "success") return data.data.task_status
        else throw new NotFoundError()
      })
      .catch((error) => {
        throw error
      })

    return data || ""
  },
  {
    response: {
      200: t.String(),
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Obtenir l'état d'une tâche de BSO-publications",
      description: "Cette route retourne les détails d'une tâche spécifique de BSO-publications via l'ID fourni.",
      tags: ["Tâches"],
    },
  }
)

export default getTaskStatus
