import { t } from "elysia";

export const postReplyToContributionSchema = t.Object(
  {
    contributionId: t.String(),
    responseMessage: t.String(),
    team: t.String(),
  },
  { additionalProperties: false }
);
