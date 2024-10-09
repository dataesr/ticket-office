import { t } from "elysia";

export const errorSchema = t.Object({
  message: t.String(),
  code: t.Optional(t.String()),
});
