import { t } from "elysia";

export const editContributionsSchema = t.Object(
  {
<<<<<<< HEAD
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
=======
    status: t.Optional(
      t.Enum({ ongoing: "ongoing", treated: "treated", new: "new" })
    ),
    extra: t.Optional(t.Record(t.String(), t.String())),
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
    team: t.Optional(t.Array(t.String())),
    tags: t.Optional(t.Array(t.String())),
    comment: t.Optional(t.String()),
    treated_at: t.Optional(t.Date()),
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> ca679c1 (feat(imap-server): add imap server)
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
<<<<<<< HEAD
=======
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
=======
>>>>>>> ca679c1 (feat(imap-server): add imap server)
    productions: t.Optional(
      t.Array(
        t.Object({
          id: t.Union([t.String(), t.Null()]),
        })
      )
    ),
<<<<<<< HEAD
=======
>>>>>>> 2e9190f (fix(api): update schemas)
=======
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
  },
  { additionalProperties: false }
);
