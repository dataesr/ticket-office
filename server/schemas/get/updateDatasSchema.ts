import { t } from "elysia";

export const updateDatasSchema = t.Object(
  {
<<<<<<< HEAD
<<<<<<< HEAD
    id: t.String(),
<<<<<<< HEAD
    treated_at: t.Optional(t.Union([t.String(), t.Date()])),
=======
    _id: t.Optional(t.String()),
=======
    id: t.String(),
>>>>>>> 2e9190f (fix(api): update schemas)
    organisation: t.Optional(t.String()),
    appName: t.Optional(t.String()),
    fonction: t.Optional(t.String()),
<<<<<<< HEAD
    treated_at: t.Optional(t.Date()),
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
=======
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
    treated_at: t.Optional(t.Union([t.String(), t.Date()])),
>>>>>>> 2e9190f (fix(api): update schemas)
    email: t.Optional(t.String()),
    name: t.Optional(t.String()),
    message: t.Optional(t.String()),
    comment: t.Optional(t.String()),
<<<<<<< HEAD
<<<<<<< HEAD
    modified_at: t.Optional(t.Union([t.String(), t.Date()])),
    created_at: t.Optional(t.Union([t.String(), t.Date()])),
<<<<<<< HEAD
    status: t.Optional(t.String()),
    extra: t.Optional(t.Record(t.String(), t.String())),
=======
    modified_at: t.Optional(t.Date()),
    created_at: t.Optional(t.Date()),
=======
    modified_at: t.Optional(t.Union([t.String(), t.Date()])),
    created_at: t.Optional(t.Union([t.String(), t.Date()])),
>>>>>>> 2e9190f (fix(api): update schemas)
    idref: t.Optional(t.String()),
    status: t.Optional(t.String()),
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
    status: t.Optional(t.String()),
    extra: t.Optional(t.Record(t.String(), t.String())),
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
    team: t.Optional(t.Array(t.String())),
    tags: t.Optional(t.Array(t.String())),
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
                read: t.Optional(t.Boolean()),
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
=======
          timestamp: t.Date(),
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
          timestamp: t.Optional(t.Union([t.String(), t.Date(), t.Null()])),
>>>>>>> 2e9190f (fix(api): update schemas)
        })
      )
    ),
  },
<<<<<<< HEAD
<<<<<<< HEAD
  { additionalProperties: true }
);
export const updataDataListSchema = t.Array(updateDatasSchema);

export const responseSchema = t.Object({
  data: updataDataListSchema,
  meta: t.Object({
    total: t.Number(),
  }),
});
<<<<<<< HEAD
=======
  { additionalProperties: false }
=======
  { additionalProperties: true }
>>>>>>> cebb1b3 (fix(api schema): update schema, delete fromApp from inconcerned object)
);
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
>>>>>>> 2bdd841 (fix(api): update schema get data for productions, remove, update route)
