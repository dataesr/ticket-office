import { t } from "elysia";

export const productionSchema = t.Object(
  {
<<<<<<< HEAD
<<<<<<< HEAD
    id: t.String(),
    objectId: t.String(),
    treated_at: t.Optional(t.Union([t.String(), t.Date()])),
    email: t.Optional(t.String()),
    name: t.Optional(t.String()),
    comment: t.Optional(t.String()),
    modified_at: t.Optional(t.Union([t.String(), t.Date()])),
    created_at: t.Optional(t.Union([t.String(), t.Date()])),
    status: t.Optional(t.String()),
    team: t.Optional(t.Array(t.String())),
    tags: t.Optional(t.Array(t.String())),
    extra: t.Optional(t.Record(t.String(), t.String())),
=======
    _id: t.Optional(t.String()),
=======
    id: t.String(),
>>>>>>> 2e9190f (fix(api): update schemas)
    organisation: t.Optional(t.String()),
    fonction: t.Optional(t.String()),
    message: t.Optional(t.String()),
    treated_at: t.Optional(t.Union([t.String(), t.Date()])),
    email: t.Optional(t.String()),
    name: t.Optional(t.String()),
    comment: t.Optional(t.String()),
    modified_at: t.Optional(t.Union([t.String(), t.Date()])),
    created_at: t.Optional(t.Union([t.String(), t.Date()])),
    idref: t.Optional(t.String()),
    status: t.Optional(t.String()),
    team: t.Optional(t.Array(t.String())),
    tags: t.Optional(t.Array(t.String())),
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
    threads: t.Optional(
      t.Array(
        t.Object({
          threadId: t.String(),
          responses: t.Optional(
            t.Array(
              t.Object({
<<<<<<< HEAD
<<<<<<< HEAD
                responseMessage: t.Union([t.String(), t.Null()]),
                read: t.Optional(t.Boolean()),
                timestamp: t.Optional(
                  t.Union([t.String(), t.Date(), t.Null()])
                ),
=======
                responseMessage: t.String(),
                timestamp: t.Date(),
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
                responseMessage: t.Union([t.String(), t.Null()]),
                timestamp: t.Optional(
                  t.Union([t.String(), t.Date(), t.Null()])
                ),
>>>>>>> 2e9190f (fix(api): update schemas)
                team: t.Optional(t.Array(t.String())),
              })
            )
          ),
<<<<<<< HEAD
<<<<<<< HEAD
          timestamp: t.Optional(t.Union([t.String(), t.Date(), t.Null()])),
        })
      )
    ),
    productions: t.Array(
      t.Object({
        id: t.Union([t.String(), t.Null()]),
      })
<<<<<<< HEAD
    ),
  },
  { additionalProperties: true }
);

export const productionListSchema = t.Array(productionSchema);

export const responseSchema = t.Object({
  data: productionListSchema,
  meta: t.Object({
    total: t.Number(),
  }),
});
=======
          timestamp: t.Date(),
=======
          timestamp: t.Optional(t.Union([t.String(), t.Date(), t.Null()])),
>>>>>>> 2e9190f (fix(api): update schemas)
        })
      )
    ),
    productions: t.Optional(
      t.Array(
        t.Object({
          id: t.Union([t.String(), t.Null()]),
          treated: t.Boolean(),
        })
      )
=======
>>>>>>> b05991b (fix(api): update schemas)
    ),
  },
  { additionalProperties: true }
);
<<<<<<< HEAD
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======

export const productionListSchema = t.Array(productionSchema);
>>>>>>> 2e9190f (fix(api): update schemas)
