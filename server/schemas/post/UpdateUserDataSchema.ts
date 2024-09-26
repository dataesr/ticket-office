import { t } from "elysia";

export const postUpdateUserDataSchema = t.Object(
  {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 220c881 (fix(api): add meta in response schema)
    email: t.String({ regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
    name: t.String(),
    message: t.String(),
    extra: t.Optional(t.Record(t.String(), t.String())),
=======
    email: t.String(),
    name: t.String(),
    message: t.String(),
<<<<<<< HEAD
    organisation: t.Optional(t.String()),
    fonction: t.Optional(t.String()),
    idref: t.Optional(t.String()),
>>>>>>> b05991b (fix(api): update schemas)
=======
    extra: t.Optional(t.Record(t.String(), t.String())),
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
  },
  { additionalProperties: false }
);
