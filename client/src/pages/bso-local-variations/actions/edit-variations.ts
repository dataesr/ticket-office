import { postHeaders } from "../../../config/api"

export default async function editVariations(ids: Array<string>, inputs: Record<string, unknown>) {
  const singleId = ids.length === 1 ? ids[0] : null
  const url = !!singleId ? `/api/bso-local-variations-publications/${singleId}` : `/api/bso-local-variations-publications`
  const data = !!singleId ? inputs : { data: inputs, ids: ids }

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
