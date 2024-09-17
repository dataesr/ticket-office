import { t } from "elysia";

export const productionSchema = t.Object(
  {
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
    organisation: t.Optional(t.String()),
    fromApp: t.Optional(t.String()),
    collectionName: t.Optional(t.String()),
    fonction: t.Optional(t.String()),
    message: t.Optional(t.String()),
    treated_at: t.Optional(t.Date()),
    email: t.Optional(t.String()),
    name: t.Optional(t.String()),
    comment: t.Optional(t.String()),
    modified_at: t.Optional(t.Date()),
    created_at: t.Optional(t.Date()),
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
                responseMessage: t.Union([t.String(), t.Null()]),
                read: t.Optional(t.Boolean()),
                timestamp: t.Optional(
                  t.Union([t.String(), t.Date(), t.Null()])
                ),
=======
                responseMessage: t.String(),
                timestamp: t.Date(),
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
                team: t.Optional(t.Array(t.String())),
              })
            )
          ),
<<<<<<< HEAD
          timestamp: t.Optional(t.Union([t.String(), t.Date(), t.Null()])),
        })
      )
    ),
    productions: t.Array(
      t.Object({
        id: t.Union([t.String(), t.Null()]),
      })
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
        })
      )
    ),
    productions: t.Optional(
      t.Array(
        t.Object({
          id: t.String(),
          treated: t.Boolean(),
        })
      )
    ),
  },
  { additionalProperties: false }
);
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
