import { VariationTags } from "../types"

export default function getStatusFromTags(tags: VariationTags): string {
  if (
    (!tags.file || tags?.file === "none") &&
    (!tags?.index || tags?.index === "none") &&
    (!tags?.notification || tags?.notification === "none")
  )
    return "new"
  if (tags?.file === "uploaded" && tags?.index === "finalized" && tags?.notification === "done") return "treated"

  return "ongoing"
}
