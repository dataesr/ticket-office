import { Elysia, NotFoundError, t } from "elysia"
import { errorSchema } from "../../../schemas/errors/errorSchema"

const url = process.env.URL_UPW

const getTaskStatus = new Elysia().get(
  "/bso-tasks/:id",
  async ({ params: { id } }) => {
    try {
      const response = await fetch(`${url}/tasks/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch bso-task")
      }

      const data = await response.json()
      if (
        data &&
        typeof data === "object" &&
        "status" in data &&
        data.status === "success" &&
        "data" in data &&
        data.data &&
        typeof data.data === "object" &&
        "task_status" in data.data
      ) {
        return String(data.data.task_status)
      } else {
        throw new NotFoundError()
      }
    } catch (error) {
      throw error
    }
  },
  {
    params: t.Object({ id: t.String() }),
    response: {
      200: t.String(),
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Obtenir l'état d'une tâche de BSO-publications",
      description:
        "Cette route retourne les détails d'une tâche spécifique de BSO-publications via l'ID fourni.",
      tags: ["Tâches"],
    },
  }
)

export default getTaskStatus
