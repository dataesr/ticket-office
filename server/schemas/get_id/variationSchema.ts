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
    states: t.Optional(
      t.Object({
        file: t.Optional(t.Enum({ none: "none", uploaded: "uploaded" })),
        code: t.Optional(t.Enum({ none: "none", staging: "staging", production: "production" })),
        index: t.Optional(t.Enum({ none: "none", ongoing: "ongoing", error: "error", finalized: "finalized" })),
        notification: t.Optional(t.Enum({ none: "none", ongoing: "ongoing", done: "done" })),
      })
    ),
    created_at: t.Optional(t.Union([t.String(), t.Date()])),
    modified_at: t.Optional(t.Union([t.String(), t.Date()])),
    treated_at: t.Optional(t.Union([t.String(), t.Date()])),
    comment: t.Optional(t.String()),
    status: t.Enum({ ongoing: "ongoing", treated: "treated", new: "new" }),
    team: t.Optional(t.Array(t.String())),
    tags: t.Optional(t.Array(t.String())),
  },
  { additionalProperties: false }
)
