import { t } from "elysia";

export const postContactSchema = t.Object(
  {
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
    email: t.String(),
    name: t.String(),
    message: t.String(),
=======
    email: t.Required(t.String()),
    name: t.Required(t.String()),
<<<<<<< HEAD
    message: t.Required(t.String()),
>>>>>>> 2b4b0b9 (feat(script): add new script to the scanr as fromApp and update nav in ui)
=======
    message: t.Optional(t.String()),
>>>>>>> dc7be2b (fix(schema): clean schemas)
    organisation: t.Optional(t.String()),
    fromApp: t.Required(t.String()),
    collectionName: t.Required(t.String()),
    fonction: t.Optional(t.String()),
    idref: t.Optional(t.String()),
    status: t.Optional(t.String()),
    created_at: t.Optional(t.Date()),
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
  },
  { additionalProperties: false }
);
