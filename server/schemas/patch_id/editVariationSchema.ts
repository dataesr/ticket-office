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
        index: t.Optional(t.String()),
        notification: t.Optional(t.Enum({ none: "none", ongoing: "ongoing", done: "done" })),
      })
    ),
    status: t.Optional(t.Enum({ ongoing: "ongoing", treated: "treated", new: "new", question: "question" })),
    created_at: t.Optional(t.Union([t.String(), t.Date()])),
    modified_at: t.Optional(t.Union([t.String(), t.Date()])),
    treated_at: t.Optional(t.Union([t.String(), t.Date()])),
    team: t.Optional(t.String()),
    comment: t.Optional(t.String()),
    threads: t.Optional(
      t.Array(
        t.Object({
          threadId: t.String(),
          responses: t.Optional(
            t.Array(
              t.Object({
                responseMessage: t.Union([t.String(), t.Null()]),
                read: t.Optional(t.Boolean()),
                timestamp: t.Optional(t.Union([t.String(), t.Date(), t.Null()])),
                team: t.Optional(t.Array(t.String())),
              })
            )
          ),
          timestamp: t.Optional(t.Union([t.String(), t.Date(), t.Null()])),
        })
      )
    ),
  },
  { additionalProperties: false }
)
