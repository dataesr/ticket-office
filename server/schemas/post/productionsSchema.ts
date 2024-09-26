import { t } from "elysia";

export const postProductionsSchema = t.Object(
  {
    email: t.String(),
    name: t.String(),
    message: t.String(),
    extra: t.Optional(t.Record(t.String(), t.String())),
    productions: t.Array(
      t.Object({
        id: t.String(),
      })
    ),
  },
  { additionalProperties: false }
);
