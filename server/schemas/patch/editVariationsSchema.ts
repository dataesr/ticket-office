import { t } from "elysia"
import { editVariationSchema } from "../patch_id/editVariationSchema"

export const editVariationsSchema = t.Object({
  ids: t.Array(t.String()),
  data: editVariationSchema,
})
