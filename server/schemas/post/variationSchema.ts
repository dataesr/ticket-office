import { t } from "elysia"

export const postVariationSchema = t.Object(
  {
    contact: t.Object({
      email: t.String({ regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
    }),
    structure: t.Object({
      id: t.Optional(t.String()),
      name: t.String(),
      acronym: t.Optional(t.String()),
    }),
    csv: t.String(),
  },
  { additionalProperties: false }
)
