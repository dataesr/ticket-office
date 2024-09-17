import { t } from "elysia";

export const postProductionsSchema = t.Object(
  {
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
    ),
  },
  { additionalProperties: false }
);
