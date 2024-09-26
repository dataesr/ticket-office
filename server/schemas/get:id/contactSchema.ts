import { t } from "elysia";

export const contactSchema = t.Object(
  {
    id: t.Optional(t.String()),
    fromApplication: t.Optional(t.String()),
    message: t.Optional(t.String()),
    treated_at: t.Optional(t.Date()),
    email: t.Optional(t.String()),
    name: t.Optional(t.String()),
    objectId: t.Optional(t.String()),
    objectType: t.Optional(t.String()),
    comment: t.Optional(t.String()),
    modified_at: t.Optional(t.Date()),
    created_at: t.Optional(t.Date()),
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
                responseMessage: t.String(),
                timestamp: t.Date(),
                team: t.Optional(t.Array(t.String())),
              })
            )
          ),
          timestamp: t.Date(),
        })
      )
    ),
  },
  { additionalProperties: false }
);
