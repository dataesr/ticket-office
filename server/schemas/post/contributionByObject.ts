import { t } from "elysia";

export const postContributionObjectSchema = t.Object(
  {
    email: t.String(),
    name: t.String(),
    message: t.Optional(t.String()),
    organisation: t.Optional(t.String()),
    section: t.Optional(t.String()),
    objectId: t.Optional(t.String()),
    objectType: t.Optional(t.String()),
    fonction: t.Optional(t.String()),
    idref: t.Optional(t.String()),
  },
  { additionalProperties: false }
);
