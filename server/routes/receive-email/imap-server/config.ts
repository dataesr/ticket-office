export const config = {
  email: process.env.MAIL_ADRESSE,
  password: process.env.MAIL_PASSWORD,
  mailHost: process.env.MAIL_HOST || "",
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017",
  dbName: process.env.MONGO_DATABASE || "ticket-office",
  brevoApiKey: process.env.BREVO_API_KEY,

  // listes de destinataires, on peut en faire un tableau pour mettre plusieurs personnes,
  //  à voir si pour le bso on veut un mail pour prévenir, pas sur
  scanrEmailRecipients: process.env.SCANR_EMAIL_RECIPIENTS?.split(",") || [],
  variationEmailRecipients: process.env.BSO_EMAIL_RECIPIENTS?.split(",") || [],
  datasuprEmailRecipients:
    process.env.DATASUPR_EMAIL_RECIPIENTS?.split(",") || [],

  defaultConfig: {
    mailSender: process.env.SCANR_MAIL_SENDER,
    senderName: "L'équipe scanR",
    templateId: 269,
    recipients: process.env.SCANR_EMAIL_RECIPIENTS?.split(",") || [],
  },

  domainConfigs: {
    "support@scanr.fr": {
      mailSender: process.env.SCANR_MAIL_SENDER,
      senderName: "L'équipe scanR",
      templateId: 269,
      recipients: process.env.SCANR_EMAIL_RECIPIENTS?.split(",") || [],
    },
    "bso@dataesr.fr": {
      mailSender: process.env.VARIATION_MAIL_SENDER,
      senderName: "L'équipe BSO",
      templateId: 269,
      recipients: process.env.BSO_EMAIL_RECIPIENTS?.split(",") || [],
    },
    "support@datasupr.fr": {
      mailSender: process.env.DATASUPR_MAIL_SENDER,
      senderName: "L'équipe DataSupR",
      templateId: 269,
      // À remplacer par le bon ID
      recipients: process.env.DATASUPR_EMAIL_RECIPIENTS?.split(",") || [],
    },
  } as Record<
    string,
    {
      mailSender: string | undefined;
      senderName: string;
      templateId: number;
      recipients: string[];
    }
  >,
};

export function validateConfig() {
  if (!config.email || !config.password || !config.mongoUri || !config.dbName) {
    throw new Error(
      "MAIL_ADRESSE, MAIL_PASSWORD, DBNAME, MONGO_URI environment variables must be defined"
    );
  }

  if (!config.brevoApiKey) {
    throw new Error("BREVO_API_KEY is not defined");
  }

  if (!config.defaultConfig.mailSender) {
    console.log(
      "SCANR_MAIL_SENDER n'est pas défini, les emails pourraient ne pas être envoyés correctement"
    );
  }

  for (const [key, domainConfig] of Object.entries(config.domainConfigs)) {
    if (!domainConfig.mailSender) {
      console.log(`Configuration d'expéditeur manquante pour ${key}`);
    }
    if (domainConfig.recipients.length === 0) {
      console.log(`Aucun destinataire configuré pour ${key}`);
    }
  }
}
