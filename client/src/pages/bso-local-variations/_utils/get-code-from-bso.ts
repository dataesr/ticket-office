import { useQuery } from "@tanstack/react-query"

const url_main = "https://raw.githubusercontent.com/dataesr/bso-ui/main/src/config/locals.json"
const url_staging = "https://raw.githubusercontent.com/dataesr/bso-ui/refs/heads/staging/src/config/locals.json"

export function getCodeFromBSO(id: string) {
  const { data: dataMain } = useQuery({
    queryKey: ["bso", "locals", "main"],
    queryFn: () => fetch(url_main).then((response) => (response.ok ? response.json() : {})),
    enabled: !!id,
  })

  const { data: dataStaging } = useQuery({
    queryKey: ["bso", "locals", "staging"],
    queryFn: () => fetch(url_staging).then((response) => (response.ok ? response.json() : {})),
    enabled: !!id,
  })

  if (dataMain && id in dataMain) return "production"
  if (dataStaging && id in dataStaging) return "none"

  return "none"
}
