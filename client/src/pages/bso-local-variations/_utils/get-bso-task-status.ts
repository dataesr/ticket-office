import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

const fetchTaskStatus = async (id: string) => {
  const status = await fetch(`/api/bso-tasks/${id}`).then((response) => {
    if (response.ok) return response.text()
    if (response.status === 404) return response.text()
  })
  return status
}

export default function getBsoTaskStatus(id: string) {
  const { data } = useQuery({
    queryKey: ["bso", "task", id],
    queryFn: () => fetchTaskStatus(id),
    enabled: !!id,
  })

  console.log("data", data)
  const status = useMemo(() => data, [data])

  return status
}
