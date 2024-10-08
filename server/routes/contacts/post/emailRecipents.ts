export const emailRecipients: { [key: string]: { to: string[] } } = {
  scanr: {
    to: process.env.SCANR_EMAIL_RECIPIENTS?.split(",") || [],
  },
  paysage: {
    to: process.env.PAYSAGE_EMAIL_RECIPIENTS?.split(",") || [],
  },
  bso: {
    to: process.env.BSO_EMAIL_RECIPIENTS?.split(",") || [],
  },
  "works-magnet": {
    to: process.env.WORKS_MAGNET_EMAIL_RECIPIENTS?.split(",") || [],
  },
  datasupr: {
    to: process.env.DATASUPR_EMAIL_RECIPIENTS?.split(",") || [],
  },
  curiexplore: {
    to: process.env.CURIEXPLORE_EMAIL_RECIPIENTS?.split(",") || [],
  },
};
