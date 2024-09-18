import { t } from "elysia";

export const postContactSchema = t.Object(
  {
    email: t.Required(t.String()),
    name: t.Required(t.String()),
    message: t.Required(t.String()),
    organisation: t.Optional(t.String()),
    fromApp: t.Required(t.String()),
    collectionName: t.Required(t.String()),
    fonction: t.Optional(t.String()),
    idref: t.Optional(t.String()),
    status: t.Optional(t.String()),
    created_at: t.Optional(t.Date()),
  },
  { additionalProperties: false }
);
