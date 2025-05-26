import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useVariationsContext } from "../context"
import { getContainer } from "../config/containers"

const fetchFileContent = async (container: string, id: string) => {
  const url = `/api/storage/${container}/${id}.csv`
  const content = await fetch(url)
    .then((response) => {
      if (response.ok) return response.json()
    })
    .then((data) => data?.fileContent)
    .catch((error) => {
      throw error
    })
  return content
}

export default function getFileContent(id: string) {
  const { api } = useVariationsContext()
  const container = getContainer(api)
  const { data, refetch } = useQuery({
    queryKey: ["ovh", "file", id],
    queryFn: () => fetchFileContent(container, id),
    enabled: !!id,
  })

  const values = useMemo(() => ({ content: data, refetch }), [data])

  return values
}
