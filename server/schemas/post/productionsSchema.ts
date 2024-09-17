import { t } from "elysia";

export const postProductionsSchema = t.Object(
  {
<<<<<<< HEAD
    objectId: t.String(),
    email: t.String({ regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
    name: t.String(),
    extra: t.Optional(t.Record(t.String(), t.String())),
    productions: t.Array(
      t.Object({
        id: t.String(),
      })
=======
    email: t.String(),
    name: t.String(),
    message: t.String(),
    created_at: t.Optional(t.Date()),
    organisation: t.Optional(t.String()),
    fromApp: t.Optional(t.String()),
    collectionName: t.Optional(t.String()),
    fonction: t.Optional(t.String()),
    idref: t.Optional(t.String()),
    status: t.Optional(t.String()),
    productions: t.Optional(
      t.Array(
        t.Object({
          id: t.String(),
          treated: t.Boolean(),
        })
      )
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
    ),
  },
  { additionalProperties: false }
);
