import { t } from "elysia";

export const postContactSchema = t.Object(
  {
    email: t.String(),
    name: t.String(),
    message: t.String(),
    organisation: t.Optional(t.String()),
    fromApp: t.String(),
    collectionName: t.String(),
    fonction: t.Optional(t.String()),
    idref: t.Optional(t.String()),
    status: t.Optional(t.String()),
    created_at: t.Optional(t.Date()),
  },
  { additionalProperties: false }
);
