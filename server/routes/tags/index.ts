import { Elysia, t } from "elysia";

import db from "../../libs/mongo";

const tagsRoutes = new Elysia().get(
  "/tags/:collection",
  ({ params: { collection } }) => db.collection(collection).distinct("tags"),
  {
    params: t.Object({
      collection: t.Enum({
        contacts: "contacts",
        contribute: "contribute",
        "remove-user": "remove-user",
        "update-user-data": "update-user-data",
      }),
    }),
    detail: {
      summary: "Obtenir les tags utilisés dans une collection",
      tags: ["Tags"],
    },
  }
);

export default tagsRoutes;
