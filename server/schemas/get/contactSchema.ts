import { t } from "elysia";

export const contactSchema = t.Object(
  {
<<<<<<< HEAD
<<<<<<< HEAD
    id: t.String(),
    fromApplication: t.Optional(t.String()),
    message: t.Optional(t.String()),
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
    fromApp: t.Optional(t.String()),
    collectionName: t.Optional(t.String()),
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
  { additionalProperties: true }
);

export const contactListSchema = t.Array(contactSchema);

export const responseSchema = t.Object({
  data: contactListSchema,
  meta: t.Object({
    total: t.Number(),
  }),
});
=======
  { additionalProperties: false }
);
<<<<<<< HEAD
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======

export const contactListSchema = t.Array(contactSchema);
>>>>>>> 2e9190f (fix(api): update schemas)
