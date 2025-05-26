import { toast } from "react-toastify"
import { Variation } from "../types"
import editVariations from "./edit-variations"
import { getContainer } from "../config/containers"

async function uploadFile(api: string, variation: Variation) {
  const container = getContainer(api)
  if (!container) {
    throw `uploadFile: Container not found for variations api ${api}`
  }

  const url = `/api/storage`
  const data = {
    container: container,
    filename: `${variation.structure?.id || variation.structure.name}.csv`,
    mimetype: "text/csv",
    buffer: variation.csv,
  }
  console.log("data", data)

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) throw new Error(`Error while uploading file for id ${variation.id}`)
    })
    .catch((error) => {
      throw error
    })
}

export default async function uploadFiles(api: string, variations: Array<Variation>) {
  const inputs = { tags: { file: "uploaded" }, status: "ongoing" }

  Promise.all(variations.map((variation) => uploadFile(api, variation)))
    .then(() => {
      editVariations(
        api,
        variations.map((variation) => variation.id),
        inputs
      )
      toast.success(
        variations?.length > 1
          ? "Les fichiers ont été chargés sur OVH avec succès !"
          : "Le fichier à été chargé sur OVH avec succès !"
      )
    })
    .catch((error) => {
      console.error("uploadFiles error:", error.message)
      toast.error("Une erreur est survenue lors du chargement des fichiers sur OVH.")
    })
}
