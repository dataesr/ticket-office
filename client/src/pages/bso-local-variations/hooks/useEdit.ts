import { postHeaders } from "../../../config/api"

const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development"
const baseURL = import.meta.env.VITE_BASE_API_URL

export default async function useEdit(id: string, inputs: Record<string, unknown>) {
  const url = isDevelopment ? `http://localhost:3000/api/variations/${id}` : `${baseURL}/api/variations/${id}`

  await fetch(url, {
    method: "PATCH",
    headers: postHeaders,
    body: JSON.stringify({ ...inputs }),
  })
    .then((response) => {
      if (!response.ok) throw new Error(`Error while patching id ${id}`)
    })
    .catch((error) => {
      throw error
    })
}
