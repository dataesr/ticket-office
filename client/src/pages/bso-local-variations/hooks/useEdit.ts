import { postHeaders } from "../../../config/api"

const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development"
const baseURL = import.meta.env.VITE_BASE_API_URL

export default async function useEdit(id: string, inputs: Record<string, unknown>) {
  const selectedProfile = localStorage.getItem("selectedProfile")
  const url = isDevelopment ? `http://localhost:3000/api/variations/${id}` : `${baseURL}/api/variations/${id}`

  const response = await fetch(url, {
    method: "PATCH",
    headers: postHeaders,
    body: JSON.stringify({ ...inputs, team: [selectedProfile] }),
  })

  if (!response.ok) throw new Error("Erreur lors de la mise à jour")

  return response
}
