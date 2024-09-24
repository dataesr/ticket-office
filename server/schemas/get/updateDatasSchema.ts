import { t } from "elysia";

export const updateDatasSchema = t.Object(
  {
    id: t.String(),
    organisation: t.Optional(t.String()),
    appName: t.Optional(t.String()),
    collectionName: t.Optional(t.String()),
    fonction: t.Optional(t.String()),
    treated_at: t.Optional(t.Union([t.String(), t.Date()])),
    email: t.Optional(t.String()),
    name: t.Optional(t.String()),
    message: t.Optional(t.String()),
    comment: t.Optional(t.String()),
    modified_at: t.Optional(t.Union([t.String(), t.Date()])),
    created_at: t.Optional(t.Union([t.String(), t.Date()])),
    idref: t.Optional(t.String()),
    status: t.Optional(t.String()),
    team: t.Optional(t.Array(t.String())),
    tags: t.Optional(t.Array(t.String())),
    threads: t.Optional(
      t.Array(
        t.Object({
          threadId: t.String(),
          responses: t.Optional(
            t.Array(
              t.Object({
                responseMessage: t.Union([t.String(), t.Null()]),
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
  { additionalProperties: false }
);
