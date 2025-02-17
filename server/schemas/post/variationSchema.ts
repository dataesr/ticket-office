import { t } from "elysia"

export const postVariationSchema = t.Object(
  {
    email: t.String({ regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
    name: t.String(),
    acronym: t.Optional(t.String()),
    siren: t.Optional(t.String()),
    rnsr: t.Optional(t.String()),
    ror: t.Optional(t.String()),
    csv: t.String(),
  },
  { additionalProperties: false }
)
