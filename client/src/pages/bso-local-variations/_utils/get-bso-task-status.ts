import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

const url: string = import.meta.env.VITE_URL_UPW

const fetchTask = async (taskId: string) => {
  const data = fetch(`${url}/tasks/${taskId}`, { mode: "no-cors" })
    .then((response) => {
      if (response.ok) return response.json()
      else console.log("response", response)
    })
    .then((data) => data)
    .catch((error) => console.log("error", error))
  return data
}

export default function getBsoTaskStatus(taskId: string) {
  const { data } = useQuery({
    queryKey: ["bso", "task", taskId],
    queryFn: () => fetchTask(taskId),
    enabled: !!taskId,
  })

  console.log("data", data)
  const status = useMemo(() => data?.data?.task_status, [data])

  return status
}
