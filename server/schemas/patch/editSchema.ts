import { t } from "elysia";

export const editContributionsSchema = t.Object(
  {
<<<<<<< HEAD
    status: t.Optional(
      t.Enum({ ongoing: "ongoing", treated: "treated", new: "new" })
    ),
    extra: t.Optional(t.Record(t.String(), t.String())),
=======
    idref: t.Optional(t.String()),
    status: t.Optional(
      t.Enum({ ongoing: "ongoing", treated: "treated", new: "new" })
    ),
>>>>>>> 2e9190f (fix(api): update schemas)
    team: t.Optional(t.Array(t.String())),
    tags: t.Optional(t.Array(t.String())),
    comment: t.Optional(t.String()),
    treated_at: t.Optional(t.Date()),
<<<<<<< HEAD
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
    productions: t.Optional(
      t.Array(
        t.Object({
          id: t.Union([t.String(), t.Null()]),
        })
      )
    ),
=======
>>>>>>> 2e9190f (fix(api): update schemas)
  },
  { additionalProperties: false }
);
