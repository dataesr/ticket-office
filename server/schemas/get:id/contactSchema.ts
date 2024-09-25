import { t } from "elysia";

export const contactSchema = t.Object(
  {
<<<<<<< HEAD
<<<<<<< HEAD
    id: t.Optional(t.String()),
    fromApplication: t.Optional(t.String()),
=======
    _id: t.Optional(t.String()),
=======
    id: t.Optional(t.String()),
>>>>>>> 2e9190f (fix(api): update schemas)
    organisation: t.Optional(t.String()),
    fromApp: t.Optional(t.String()),
    fonction: t.Optional(t.String()),
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
    message: t.Optional(t.String()),
    treated_at: t.Optional(t.Date()),
    email: t.Optional(t.String()),
    name: t.Optional(t.String()),
<<<<<<< HEAD
    objectId: t.Optional(t.String()),
    objectType: t.Optional(t.String()),
    comment: t.Optional(t.String()),
    modified_at: t.Optional(t.Date()),
    created_at: t.Optional(t.Date()),
=======
    comment: t.Optional(t.String()),
    modified_at: t.Optional(t.Date()),
    created_at: t.Optional(t.Date()),
    idref: t.Optional(t.String()),
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
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
