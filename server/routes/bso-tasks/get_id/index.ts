import { Elysia, NotFoundError, t } from "elysia"
import { errorSchema } from "../../../schemas/errors/errorSchema"

const url = process.env.URL_UPW

const getTaskStatus = new Elysia().get(
  "/bso-tasks/:id",
  async ({ params: { id }, set }) => {
    try {
      const response = await fetch(`${url}/tasks/${id}`)
      if (!response.ok) {
        set.status = 500
        return { message: "Failed to fetch bso-task" }
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
        set.status = 404
        return { message: "Task not found" }
      }
    } catch (error) {
      set.status = 500
      return { message: "Error processing request" }
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
