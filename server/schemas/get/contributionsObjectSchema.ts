import { t } from "elysia";

export const contributionObjectSchema = t.Object(
  {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    id: t.String(),
<<<<<<< HEAD
    message: t.Optional(t.String()),
    treated_at: t.Optional(t.Union([t.String(), t.Date()])),
    email: t.Optional(t.String()),
    name: t.Optional(t.String()),
    comment: t.Optional(t.String()),
    objectId: t.String(),
    objectType: t.String(),
    modified_at: t.Optional(t.Union([t.String(), t.Date()])),
    created_at: t.Optional(t.Union([t.String(), t.Date()])),
    section: t.Optional(t.String()),
    status: t.Optional(t.String()),
    team: t.Optional(t.Array(t.String())),
    tags: t.Optional(t.Array(t.String())),
    extra: t.Optional(t.Record(t.String(), t.String())),
=======
    _id: t.String(),
=======
    _id: t.Optional(t.String()),
>>>>>>> dc7be2b (fix(schema): clean schemas)
=======
    id: t.String(),
>>>>>>> 2e9190f (fix(api): update schemas)
    organisation: t.Optional(t.String()),
    fonction: t.Optional(t.String()),
=======
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
    message: t.Optional(t.String()),
    treated_at: t.Optional(t.Union([t.String(), t.Date()])),
    email: t.Optional(t.String()),
    name: t.Optional(t.String()),
    comment: t.Optional(t.String()),
    objectId: t.Optional(t.String()),
    objectType: t.Optional(t.String()),
    modified_at: t.Optional(t.Union([t.String(), t.Date()])),
    created_at: t.Optional(t.Union([t.String(), t.Date()])),
    section: t.Optional(t.String()),
    status: t.Optional(t.String()),
    team: t.Optional(t.Array(t.String())),
    tags: t.Optional(t.Array(t.String())),
<<<<<<< HEAD
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
    extra: t.Optional(t.Record(t.String(), t.String())),
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
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

export const contributionObjectListSchema = t.Array(contributionObjectSchema);

export const responseSchema = t.Object({
  data: contributionObjectListSchema,
  meta: t.Object({
    total: t.Number(),
  }),
});
<<<<<<< HEAD
=======
  { additionalProperties: false }
);
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
  { additionalProperties: true }
);

export const contributionObjectListSchema = t.Array(contributionObjectSchema);
>>>>>>> 2e9190f (fix(api): update schemas)
=======
>>>>>>> 2bdd841 (fix(api): update schema get data for productions, remove, update route)
