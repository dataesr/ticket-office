import { t } from "elysia";

export const postUpdateUserDataSchema = t.Object(
  {
    email: t.String(),
    name: t.String(),
    message: t.String(),
    organisation: t.Optional(t.String()),
    fonction: t.Optional(t.String()),
    idref: t.Optional(t.String()),
  },
  { additionalProperties: false }
);
