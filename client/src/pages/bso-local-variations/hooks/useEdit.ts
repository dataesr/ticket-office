import { postHeaders } from "../../../config/api"

const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development"
const baseURL = import.meta.env.VITE_BASE_API_URL

export default async function useEdit(ids: string | Array<string>, inputs: Record<string, unknown>) {
  let url = isDevelopment ? `http://localhost:3000/api/variations` : `${baseURL}/api/variations`

  if (typeof ids === "string") url += `/${ids}`

  const data = Array.isArray(ids) ? { data: inputs, ids: ids } : inputs

  await fetch(url, {
    method: "PATCH",
    headers: postHeaders,
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) throw new Error(`Error while patching ids ${ids}`)
    })
    .catch((error) => {
      throw error
    })
}
