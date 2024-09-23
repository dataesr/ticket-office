import { t } from "elysia";

export const deleteSchema = t.Object(
  {
<<<<<<< HEAD
<<<<<<< HEAD
    id: t.String(),
    treated_at: t.Optional(t.Union([t.String(), t.Date()])),
=======
    _id: t.String(),
=======
    _id: t.Optional(t.String()),
>>>>>>> dc7be2b (fix(schema): clean schemas)
    organisation: t.Optional(t.String()),
    appName: t.Optional(t.String()),
    collectionName: t.Optional(t.String()),
    fonction: t.Optional(t.String()),
    treated_at: t.Optional(t.Date()),
<<<<<<< HEAD
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
    email: t.String(),
    name: t.String(),
=======
    email: t.Optional(t.String()),
    name: t.Optional(t.String()),
>>>>>>> dc7be2b (fix(schema): clean schemas)
    message: t.String(),
    comment: t.Optional(t.String()),
<<<<<<< HEAD
    modified_at: t.Optional(t.Union([t.String(), t.Date()])),
    created_at: t.Optional(t.Union([t.String(), t.Date()])),
    status: t.Optional(t.String()),
    team: t.Optional(t.Array(t.String())),
    tags: t.Optional(t.Array(t.String())),
    extra: t.Optional(t.Record(t.String(), t.String())),
=======
    modified_at: t.Date(),
    created_at: t.Date(),
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
=======
          timestamp: t.Date(),
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
        })
      )
    ),
  },
<<<<<<< HEAD
  { additionalProperties: true }
);
export const deleteListSchema = t.Array(deleteSchema);

export const responseSchema = t.Object({
  data: deleteListSchema,
  meta: t.Object({
    total: t.Number(),
  }),
});
=======
  { additionalProperties: false }
);
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
