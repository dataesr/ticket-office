import { t } from "elysia";

export const postProductionsSchema = t.Object(
  {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    objectId: t.String(),
=======
>>>>>>> 220c881 (fix(api): add meta in response schema)
    email: t.String({ regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
    name: t.String(),
<<<<<<< HEAD
    extra: t.Optional(t.Record(t.String(), t.String())),
=======
    message: t.String(),
<<<<<<< HEAD
    organisation: t.Optional(t.String()),
    fonction: t.Optional(t.String()),
    idref: t.Optional(t.String()),
>>>>>>> 1d32145 (fix(collectionName): delete collectionName fields)
=======
    extra: t.Optional(t.Record(t.String(), t.String())),
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
    productions: t.Array(
      t.Object({
        id: t.String(),
      })
=======
    email: t.String(),
    name: t.String(),
    message: t.String(),
<<<<<<< HEAD
=======
    email: t.Required(t.String()),
    name: t.Required(t.String()),
<<<<<<< HEAD
    message: t.Optional(t.Date()),
>>>>>>> dc7be2b (fix(schema): clean schemas)
=======
    message: t.Required(t.String()),
>>>>>>> f850256 (fix(router): update router, clean types, and requier things in post schema)
=======
    email: t.String(),
    name: t.String(),
    message: t.String(),
>>>>>>> 7077f11 (fix(schema): update post schema for contact)
    created_at: t.Optional(t.Date()),
=======
>>>>>>> b05991b (fix(api): update schemas)
    organisation: t.Optional(t.String()),
    collectionName: t.Literal("contribute_productions"),
    fonction: t.Optional(t.String()),
    idref: t.Optional(t.String()),
<<<<<<< HEAD
    status: t.Optional(t.String()),
    productions: t.Optional(
      t.Array(
        t.Object({
          id: t.String(),
          treated: t.Boolean(),
        })
      )
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
    productions: t.Array(
      t.Object({
        id: t.String(),
      })
>>>>>>> b05991b (fix(api): update schemas)
    ),
  },
  { additionalProperties: false }
);
