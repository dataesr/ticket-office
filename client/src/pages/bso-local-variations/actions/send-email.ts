import { toast } from "react-toastify"
import { Variation, VariationsTypes } from "../types"
import editVariations from "./edit-variations"
import { notificationGetTemplate } from "../config/notifications"

const messageTemplate = (variation: Variation) =>
  `<ul><li>Nom de la structure: ${
    variation.structure.name
  }</li><li>Identifiant de la structure: ${
    variation.structure?.id || "Non renseigné"
  }</li><li>Date de la demande: ${new Date(
    variation.created_at
  ).toLocaleDateString()}</li></ul>`

async function sendEmail(
  api: VariationsTypes,
  variation: Variation,
  response: string
) {
  const url = `/api/send-email`
  const selectedProfile = localStorage.getItem("selectedProfile")
  const formattedResponse = response.replace(/\n/g, "<br/>")

  const emailPayload = {
    contributionId: variation.id,
    to: variation.contact.email,
    name: variation.contact.email.split("@")[0],
    subject: `Réponse à votre demande de déclinaison locale, référence bso-${variation.id}`,
    userResponse: formattedResponse,
    message: messageTemplate(variation),
    collectionName: `bso_local_variations_${api}`,
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
      if (!response.ok)
        throw new Error(`Error while sending email: ${response.status}`)
    })
    .catch((error) => {
      throw error
    })
}

export default async function sendEmails(
  api: VariationsTypes,
  variations: Array<Variation>,
  notification: string,
  response: string,
  useTemplate?: boolean,
  getCommentsName?: (id: string) => string
) {
  // Set status as treated if final notification sent
  const inputs = {
    tags: { notification: notification },
    status: notification === "done" ? "treated" : "ongoing",
  }

  // If single variation and notification is custom, set correct status (should only happen from email-box)
  if (variations.length === 1 && notification === "custom")
    inputs.status =
      variations[0].tags?.notification === "done" ? "treated" : "ongoing"

  Promise.all(
    variations.map((variation) =>
      sendEmail(
        api,
        variation,
        useTemplate
          ? notificationGetTemplate(
              notification,
              variation.structure?.id,
              getCommentsName(variation.structure?.id)
            )
          : response
      )
    )
  )
    .then(() => {
      if (["custom", "ongoing", "done"].includes(notification)) {
        editVariations(
          api,
          variations.map((variation) => variation.id),
          inputs
        )
      }
      toast.success(
        variations?.length > 1
          ? "Les emails ont été envoyés avec succès !"
          : "L'email à été envoyé avec succès !"
      )
    })
    .catch((error) => {
      console.error("sendEmails error:", error.message)
      toast.error("Une erreur est survenue lors de l'envoi des emails")
    })
}
