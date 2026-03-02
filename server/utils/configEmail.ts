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
  datasupr: {
    senderEmail: process.env.DATASUPR_MAIL_SENDER,
    senderName: "L'équipe dataSupr",
    replyToEmail: "datasupr@recherche.gouv.fr",
    replyToName: "L'équipe dataSupr",
    templateId: 268,
  },
};

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
    bcc: [
      {
        name: "Baromètre français de la Science Ouverte",
        email: "bso@recherche.gouv.fr",
      },
    ],
    templateId: 272,
  },
  datasupr: {
    senderEmail: process.env.DATASUPR_MAIL_SENDER,
    senderName: "L'équipe dataSupr",
    replyToEmail: "support@scanr.fr",
    replyToName: "L'équipe dataSupr",
    templateId: 267,
  },
};
