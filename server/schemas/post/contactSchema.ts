import { t } from "elysia";

export const postContactSchema = t.Object(
  {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 220c881 (fix(api): add meta in response schema)
    email: t.String({ regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
    name: t.String(),
    message: t.String(),
    fromApplication: t.Enum({
      paysage: "paysage",
      scanr: "scanr",
      bso: "bso",
      "works-magnet": "works-magnet",
      datasupr: "datasupr",
      curiexplore: "curiexplore",
    }),
    extra: t.Optional(
      t.Record(t.String(), t.String(), {
        example: {
          exemple: "exemple",
          idref: "4134",
          fonction: "chercheur",
          organisation: "Université",
          subApplication: "teds",
        },
      })
    ),
<<<<<<< HEAD
=======
    email: t.String(),
    name: t.String(),
    message: t.String(),
<<<<<<< HEAD
=======
    email: t.Required(t.String()),
    name: t.Required(t.String()),
<<<<<<< HEAD
<<<<<<< HEAD
    message: t.Required(t.String()),
>>>>>>> 2b4b0b9 (feat(script): add new script to the scanr as fromApp and update nav in ui)
=======
    message: t.Optional(t.String()),
>>>>>>> dc7be2b (fix(schema): clean schemas)
=======
    message: t.Required(t.String()),
>>>>>>> f850256 (fix(router): update router, clean types, and requier things in post schema)
=======
    email: t.String(),
    name: t.String(),
    message: t.String(),
>>>>>>> 7077f11 (fix(schema): update post schema for contact)
    organisation: t.Optional(t.String()),
    fromApp: t.Enum({
=======
    fromApplication: t.Enum({
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
      paysage: "paysage",
      scanr: "scanr",
      bso: "bso",
      "works-magnet": "works-magnet",
      datasupr: "datasupr",
      curiexplore: "curiexplore",
    }),
<<<<<<< HEAD
    fromSubApp: t.Optional(t.String()),
    fonction: t.Optional(t.String()),
    idref: t.Optional(t.String()),
<<<<<<< HEAD
    status: t.Optional(t.String()),
    created_at: t.Optional(t.Date()),
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
>>>>>>> 9a22dff (fix(api schema): set schema to accept waited values inf fromApp and collectionName)
=======
    extra: t.Optional(t.Record(t.String(), t.String())),
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
=======
>>>>>>> b019d42 (fix(schema): add exemple to post contacts schema)
  },
  { additionalProperties: false }
);
