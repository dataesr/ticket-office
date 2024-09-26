import { t } from "elysia";

export const postRemoveUserSchema = t.Object(
  {
    email: t.String(),
    name: t.String(),
    message: t.String(),
    extra: t.Optional(t.Record(t.String(), t.String())),
  },
  { additionalProperties: false }
);
