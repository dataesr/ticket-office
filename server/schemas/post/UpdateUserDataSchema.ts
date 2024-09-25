import { t } from "elysia";

export const postUpdateUserDataSchema = t.Object(
  {
<<<<<<< HEAD
    email: t.String({ regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
    name: t.String(),
    message: t.String(),
    extra: t.Optional(t.Record(t.String(), t.String())),
=======
    email: t.String(),
    name: t.String(),
    message: t.String(),
    organisation: t.Optional(t.String()),
    fonction: t.Optional(t.String()),
    idref: t.Optional(t.String()),
>>>>>>> b05991b (fix(api): update schemas)
  },
  { additionalProperties: false }
);
