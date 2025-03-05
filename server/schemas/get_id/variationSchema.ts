import { t } from "elysia"

export const variationSchema = t.Object(
  {
    id: t.String(),
    contact: t.Object({
      email: t.String(),
    }),
    structure: t.Object({
      id: t.Optional(t.String()),
      name: t.String(),
      acronym: t.Optional(t.String()),
    }),
    tags: t.Object({
      file: t.Enum({ none: "none", uploaded: "uploaded" }),
      index: t.Optional(t.String()),
      notification: t.Enum({ none: "none", ongoing: "ongoing", done: "done" }),
    }),
    csv: t.String(),
    created_at: t.Optional(t.Union([t.String(), t.Date()])),
    modified_at: t.Optional(t.Union([t.String(), t.Date()])),
    treated_at: t.Optional(t.Union([t.String(), t.Date()])),
    status: t.Enum({ ongoing: "ongoing", treated: "treated", new: "new" }),
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
