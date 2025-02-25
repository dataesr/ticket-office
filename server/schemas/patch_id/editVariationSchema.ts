import { t } from "elysia"

export const editVariationSchema = t.Object(
  {
    contact: t.Optional(
      t.Object({
        email: t.Optional(t.String({ regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })),
      })
    ),
    structure: t.Optional(
      t.Object({
        id: t.Optional(t.String()),
        name: t.Optional(t.String()),
        acronym: t.Optional(t.String()),
      })
    ),
    tags: t.Optional(
      t.Object({
        file: t.Optional(t.Enum({ none: "none", uploaded: "uploaded" })),
        code: t.Optional(t.Enum({ none: "none", staging: "staging", production: "production" })),
        index: t.Optional(t.Enum({ none: "none", ongoing: "ongoing", error: "error", finalized: "finalized" })),
        notification: t.Optional(t.Enum({ none: "none", ongoing: "ongoing", done: "done" })),
      })
    ),
    status: t.Optional(t.Enum({ ongoing: "ongoing", treated: "treated", new: "new" })),
    created_at: t.Optional(t.Union([t.String(), t.Date()])),
    modified_at: t.Optional(t.Union([t.String(), t.Date()])),
    treated_at: t.Optional(t.Union([t.String(), t.Date()])),
    team: t.Optional(t.String()),
    comment: t.Optional(t.String()),
  },
  { additionalProperties: false }
)
