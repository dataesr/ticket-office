import { t } from "elysia"

export const variationSchema = t.Object(
  {
    id: t.String(),
    contact: t.Object({
      email: t.String(),
    }),
    structure: t.Object({
      name: t.String(),
      acronym: t.Optional(t.String()),
      ids: t.Object({
        siren: t.Optional(t.String()),
        rnsr: t.Optional(t.String()),
        ror: t.Optional(t.String()),
      }),
    }),
    tags: t.Object({
      file: t.Enum({ none: "none", uploaded: "uploaded" }),
      code: t.Enum({ none: "none", staging: "staging", production: "production" }),
      index: t.Enum({ none: "none", ongoing: "ongoing", error: "error", finalized: "finalized" }),
      notification: t.Enum({ none: "none", ongoing: "ongoing", done: "done" }),
    }),
    csv: t.String(),
    created_at: t.Optional(t.Union([t.String(), t.Date()])),
    modified_at: t.Optional(t.Union([t.String(), t.Date()])),
    treated_at: t.Optional(t.Union([t.String(), t.Date()])),
    status: t.Enum({ ongoing: "ongoing", treated: "treated", new: "new" }),
    team: t.Optional(t.Array(t.String())),
    comment: t.Optional(t.String()),
  },
  { additionalProperties: false }
)
