import { toast } from "react-toastify"
import { Variation } from "../types"
import { apiUrl } from "../../../api/utils/url"
import editVariations from "./edit-variations"

const messageTemplate = (variation: Variation) => `<ul><li>Nom de la structure: ${variation.structure.name}</li></ul>`

async function sendEmail(variation: Variation, response: string) {
  const url = `${apiUrl}/api/send-email`
  const selectedProfile = localStorage.getItem("selectedProfile")
  const formattedResponse = response.replace(/\n/g, "<br/>")

  const emailPayload = {
    contributionId: variation.id,
    to: variation.contact.email,
    subject: `Réponse à votre demande de déclinaison locale, référence bso-${variation.id}`,
    userResponse: formattedResponse,
    message: messageTemplate(variation),
    collectionName: "local_variations",
    selectedProfile,
  }

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailPayload),
  })
    .then((response) => {
      if (!response.ok) throw new Error(`Error while sending email: ${response.status}`)
    })
    .catch((error) => {
      throw error
    })
}

export default async function sendEmails(variations: Array<Variation>, notification: string, response: string) {
  const inputs = { tags: { notification: notification }, status: "ongoing" }

  Promise.all(variations.map((variation) => sendEmail(variation, response)))
    .then(() => {
      if (["ongoing", "done"].includes(notification)) {
        editVariations(
          variations.map((variation) => variation.id),
          inputs
        )
      }
      toast.success(
        variations?.length > 1 ? "Les emails ont été envoyés avec succès !" : "L'email à été envoyé avec succès !"
      )
    })
    .catch((error) => {
      console.error("sendEmails error:", error.message)
      toast.error("Une erreur est survenue lors de l'envoi des emails")
    })
}
