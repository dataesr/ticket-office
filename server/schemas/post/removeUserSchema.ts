import { t } from "elysia";

export const postRemoveUserSchema = t.Object(
  {
    email: t.String(),
    name: t.String(),
    message: t.String(),
    organisation: t.Optional(t.String()),
    collectionName: t.Literal("remove-user"),
    fonction: t.Optional(t.String()),
    idref: t.Optional(t.String()),
  },
  { additionalProperties: false }
);
