import { toast } from "react-toastify"
import { Variation } from "../types"
import editVariations from "./edit-variations"

export default async function updateIndex(variations: Array<Variation>, data: Record<string, unknown>) {
  const inputs = { tags: { index: data?.index_name } }

  fetch("/api/bso-tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        editVariations(
          variations.map((variation) => variation.id),
          inputs
        )
        toast.success("L'index a été lancé avec succès !")
      }
    })
    .catch((error) => {
      console.error("updateIndex error:", error.message)
      toast.error("Une erreur est survenue lors de la création de l'index")
    })
}
