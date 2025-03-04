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
    replyToEmail: "support@bso.fr",
    replyToName: "L'équipe BSO",
    templateId: 999,
  },
  //   Modifier Template de création de contribution pour BSO
  //   Et adresse mail de l'équipe BSO
};
