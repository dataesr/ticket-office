import { toast } from "react-toastify"
import { rangeArray } from "../../../utils/array"
import { Variation } from "../types"
import editVariations from "./edit-variations"

const url = import.meta.env.VITE_URL_UPW
const password = import.meta.env.VITE_PUBLIC_API_PASSWORD

export default async function updateIndex(variations: Array<Variation>, data: Record<string, unknown>) {
  const inputs = { tags: { index: data?.index_name } }
  const chunks = rangeArray(0, 8)

  Promise.all(
    chunks.map((idx) => {
      data.split_idx = idx
      data.PUBLIC_API_PASSWORD = password
      fetch(`${url}/et`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) throw new Error(`Error while updating index ${data?.index_name}`)
        })
        .catch((error) => {
          throw new Error(error)
        })
    })
  )
    .then(() => {
      editVariations(
        variations.map((variation) => variation.id),
        inputs
      )
      toast.success("L'index a été lancé avec succès !")
    })
    .catch((error) => {
      console.error("updateIndex error:", error.message)
      toast.error("Une erreur est survenue lors de la création de l'index")
    })
}
