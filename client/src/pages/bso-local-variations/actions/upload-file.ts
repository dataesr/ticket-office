import { Variation } from "../types"

export default async function UploadFile(variation: Variation) {

  const data = {
    container: "bso-local",
    filename: `${variation.structure?.id || variation.structure.name}.csv`,
    mimetype: "text/csv",
    buffer: variation.csv,
  }

  fetch("/api/storage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText)
      }
      return response.json()
    })
    .then((data) => {
      console.log("Success:", data)
    })
    .catch((error) => {
      throw new Error(error)
    })
}
