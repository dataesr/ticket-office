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

  const status = useMemo(() => {
    if (!id) return "none"
    if (["queued", "deferred", "started"].includes(data)) return "ongoing"
    if (data === "finished") return "finalized"
    if (data === "failed") return "failed"
    return "finalized"
  }, [id, data])

  return status
}
