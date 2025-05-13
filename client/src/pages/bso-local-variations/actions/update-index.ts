import { toast } from "react-toastify"
import { Variation } from "../types"
import editVariations from "./edit-variations"

export default async function updateIndex(api: string, variations: Array<Variation>, data: Record<string, unknown>) {
  const indexName = data.index_name
  const url = `/api/bso-tasks`

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) return response.json()
    })
    .then((data) => {
      editVariations(
        api,
        variations.map((variation) => variation.id),
        { tags: { index: data.id } }
      )
      toast.success(`L'index ${indexName} a été lancé avec succès ! (id: ${data.id})`)
    })
    .catch((error) => {
      console.error("updateIndex error:", error.message)
      toast.error("Une erreur est survenue lors de la création de l'index")
    })
}
