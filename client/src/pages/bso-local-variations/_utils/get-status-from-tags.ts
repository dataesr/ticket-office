import { VariationTags } from "../types"

export default function getStatusFromTags(tags: VariationTags): string {
  if (tags.file === "none" && tags.code === "none" && tags.index === "none" && tags.notification === "none") return "new"
  if (tags.file === "uploaded" && tags.code === "production" && tags.index === "finalized" && tags.notification === "done")
    return "treated"

  return "ongoing"
}
