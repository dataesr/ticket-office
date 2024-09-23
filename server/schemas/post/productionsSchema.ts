import { t } from "elysia";

export const postProductionsSchema = t.Object(
  {
    email: t.Required(t.String()),
    name: t.Required(t.String()),
    message: t.Required(t.String()),
    created_at: t.Optional(t.Date()),
    organisation: t.Optional(t.String()),
    collectionName: t.Required(t.String()),
    fonction: t.Optional(t.String()),
    idref: t.Optional(t.String()),
    status: t.Optional(t.String()),
    productions: t.Required(
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
