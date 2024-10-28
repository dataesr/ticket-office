import { t } from "elysia";

export const lastMailsSentSchema = t.Object(
  {
    id: t.String(),
    name: t.String(),
    subject: t.String(),
    userResponse: t.String(),
    selectedProfile: t.String(),
    message: t.String(),
    sentAt: t.Date(),
    contributionId: t.String(),
    collectionName: t.String(),
    status: t.String(),
  },
  { additionalProperties: true }
);
