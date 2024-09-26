import { t } from "elysia";

export const postRemoveUserSchema = t.Object(
  {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    email: t.String({ regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
    name: t.String(),
    message: t.String(),
    extra: t.Optional(t.Record(t.String(), t.String())),
=======
    email: t.String(),
=======
    email: t.Required(t.String()),
<<<<<<< HEAD
>>>>>>> dc7be2b (fix(schema): clean schemas)
    name: t.String(),
    message: t.String(),
=======
    name: t.Required(t.String()),
    message: t.Required(t.String()),
>>>>>>> f850256 (fix(router): update router, clean types, and requier things in post schema)
=======
    email: t.String(),
    name: t.String(),
    message: t.String(),
<<<<<<< HEAD
>>>>>>> 7077f11 (fix(schema): update post schema for contact)
    organisation: t.Optional(t.String()),
    fonction: t.Optional(t.String()),
    idref: t.Optional(t.String()),
<<<<<<< HEAD
    status: t.Optional(t.String()),
    created_at: t.Optional(t.Date()),
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
>>>>>>> b05991b (fix(api): update schemas)
=======
    extra: t.Optional(t.Record(t.String(), t.String())),
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
  },
  { additionalProperties: false }
);
