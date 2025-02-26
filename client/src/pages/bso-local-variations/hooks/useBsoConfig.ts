import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

const url_main = "https://raw.githubusercontent.com/dataesr/bso-ui/main/src/config/locals.json"
const url_staging = "https://raw.githubusercontent.com/dataesr/bso-ui/refs/heads/staging/src/config/locals.json"

type bsoConfig = {
  main: Array<string>
  staging: Array<string>
}

export default function useBsoConfig() {
  const { data: dataMain } = useQuery({
    queryKey: ["bso", "locals", "main"],
    queryFn: () => fetch(url_main).then((response) => (response.ok ? response.json() : {})),
  })

  const { data: dataStaging } = useQuery({
    queryKey: ["bso", "locals", "staging"],
    queryFn: () => fetch(url_staging).then((response) => (response.ok ? response.json() : {})),
  })

  const data: bsoConfig = useMemo(() => {
    return {
      main: Object.keys(dataMain || {}),
      staging: Object.keys(dataStaging || {}),
    }
  }, [dataMain, dataStaging])
  return data
}
