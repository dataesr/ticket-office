import { t } from "elysia";

export const deleteSchema = t.Object(
  {
    id: t.String(),
    treated_at: t.Optional(t.Union([t.String(), t.Date()])),
    email: t.String(),
    name: t.String(),
    message: t.String(),
    comment: t.Optional(t.String()),
    modified_at: t.Optional(t.Union([t.String(), t.Date()])),
    created_at: t.Optional(t.Union([t.String(), t.Date()])),
    status: t.Optional(t.String()),
    team: t.Optional(t.Array(t.String())),
    tags: t.Optional(t.Array(t.String())),
    extra: t.Optional(t.Record(t.String(), t.String())),
    contributionType: t.Optional(t.String()),
    threads: t.Optional(
      t.Array(
        t.Object({
          threadId: t.String(),
          responses: t.Optional(
            t.Array(
              t.Object({
                responseMessage: t.Union([t.String(), t.Null()]),
                read: t.Optional(t.Boolean()),
                timestamp: t.Optional(
                  t.Union([t.String(), t.Date(), t.Null()])
                ),
                team: t.Optional(t.Array(t.String())),
              })
            )
          ),
          timestamp: t.Optional(t.Union([t.String(), t.Date(), t.Null()])),
        })
      )
    ),
  },
  { additionalProperties: true }
);
export const deleteListSchema = t.Array(deleteSchema);

export const responseSchema = t.Object({
  data: deleteListSchema,
  meta: t.Object({
    total: t.Number(),
  }),
});
