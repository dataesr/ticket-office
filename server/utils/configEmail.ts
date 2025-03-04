export const newContributionEmailConfig = {
  scanr: {
    senderEmail: process.env.SCANR_MAIL_SENDER,
    senderName: "L'équipe scanR",
    replyToEmail: "support@scanr.fr",
    replyToName: "L'équipe scanR",
    templateId: 268,
  },
  bso: {
    senderEmail: process.env.VARIATION_MAIL_SENDER,
    senderName: "L'équipe BSO",
    replyToEmail: "bso@dataesr.fr",
    replyToName: "L'équipe BSO",
    templateId: 272,
  },
}

export const replyEmailConfig = {
  scanr: {
    senderEmail: process.env.SCANR_MAIL_SENDER,
    senderName: "L'équipe scanR",
    replyToEmail: "support@scanr.fr",
    replyToName: "L'équipe scanR",
    templateId: 267,
  },
  bso: {
    senderEmail: process.env.VARIATION_MAIL_SENDER,
    senderName: "L'équipe BSO",
    replyToEmail: "bso@dataesr.fr",
    replyToName: "L'équipe BSO",
    templateId: 272,
  },
}
