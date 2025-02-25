import useEdit from "../hooks/useEdit"
import { toast } from "react-toastify"
import { Variation } from "../types"

async function uploadFile(variation: Variation) {
  const data = {
    container: "bso-local",
    filename: `${variation.structure?.id || variation.structure.name}.csv`,
    mimetype: "text/csv",
    buffer: variation.csv,
  }

  const inputs = {
    tags: { file: "uploaded" },
    ...(variation.status === "new" && { status: "ongoing" }),
  }

  fetch("/api/storage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(() => {
      try {
        useEdit(variation.id, inputs)
      } catch (error) {
        throw error
      }
    })
    .catch((error) => {
      throw error
    })
}

export default async function uploadFiles(variations: Array<Variation>) {
  Promise.all(variations.map((variation) => uploadFile(variation)))
    .then(() => {
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
