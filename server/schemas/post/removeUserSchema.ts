import { t } from "elysia";

export const postRemoveUserSchema = t.Object(
  {
    email: t.String({ regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
    name: t.String(),
    message: t.String(),
    extra: t.Optional(t.Record(t.String(), t.String())),
  },
  { additionalProperties: false }
);
