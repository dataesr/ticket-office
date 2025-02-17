import { t } from "elysia"
import { variationSchema } from "../get_id/variationSchema"

export const variationListSchema = t.Array(variationSchema)

export const responseSchema = t.Object({
  data: variationListSchema,
  meta: t.Object({
    total: t.Number(),
  }),
})
