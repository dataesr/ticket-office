import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

const fetchFileContent = async (id: string) => {
  const url = `/api/storage/bso-local/${id}.csv`
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
  const { data, refetch } = useQuery({
    queryKey: ["ovh", "file", id],
    queryFn: () => fetchFileContent(id),
    enabled: !!id,
  })

  const values = useMemo(() => ({ content: data, refetch }), [data])

  return values
}
