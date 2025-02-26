import { useVariationsContext } from "../context"

export function getCodeFromBSO(id: string) {
  const {
    bsoConfig: { main, staging },
  } = useVariationsContext()

  if (main && main.includes(id)) return "production"
  if (staging && staging.includes(id)) return "staging"

  return "none"
}
