import { Elysia } from "elysia";
import { sendMattermostNotification } from "../../utils/sendMattermostNotification";
import {
  CertificateReport,
  calculateRemainingDays,
  generateStatusAndUrgency,
  getSSLExpiryDate,
} from "../../utils/certificateChecker";

const SITES = [
  "api.paysage.dataesr.ovh",
  "barometredelascienceouverte.esr.gouv.fr",
  "bso.dataesr.ovh",
  "bso.staging.dataesr.ovh",
  "catalogue.dataesr.ovh",
  "catalogue.staging.dataesr.ovh",
  "cluster-production.elasticsearch.dataesr.ovh",
  "curiexplore.dataesr.ovh",
  "curiexplore.enseignementsup-recherche.gouv.fr",
  "curiexplore.staging.dataesr.ovh",
  "data.enseignementsup-recherche.gouv.fr",
  "data.esr.gouv.fr",
  "datafresq.dataesr.ovh",
  "datafresq.staging.dataesr.ovh",
  "frenchopensciencemonitor.esr.gouv.fr",
  "paysage-api.staging.dataesr.ovh",
  "paysage.dataesr.ovh",
  "paysage.enseignementsup-recherche.gouv.fr",
  "paysage.staging.dataesr.ovh",
  "piwik.enseignementsup-recherche.pro",
  "publication.enseignementsup-recherche.gouv.fr",
  "scanr.dataesr.ovh",
  "scanr.enseignementsup-recherche.gouv.fr",
  "scanr.staging.dataesr.ovh",
  "ticket-office.dataesr.ovh",
  "ticket-office.staging.dataesr.ovh",
  "works-magnet.dataesr.ovh",
  "works-magnet.esr.gouv.fr",
  "works-magnet.staging.dataesr.ovh",
];

const NOTIFICATION_THRESHOLDS = [20, 10];

const notifiedThresholds = new Map<string, Set<number>>();

function getNotificationThreshold(
  site: string,
  remainingDays: number
): number | null {
  if (remainingDays > Math.max(...NOTIFICATION_THRESHOLDS)) {
    notifiedThresholds.delete(site);
    return null;
  }

  const notified = notifiedThresholds.get(site) ?? new Set<number>();

  for (const threshold of NOTIFICATION_THRESHOLDS) {
    if (remainingDays <= threshold && !notified.has(threshold)) {
      notified.add(threshold);
      notifiedThresholds.set(site, notified);
      return threshold;
    }
  }

  return null;
}

async function checkAndNotifyCertificates(notify: boolean) {
  const report: CertificateReport[] = [];

  await Promise.all(
    SITES.map(async (site) => {
      try {
        const expiryDate = await getSSLExpiryDate(site);
        const remainingDays = calculateRemainingDays(expiryDate);
        const { status, urgency } = generateStatusAndUrgency(remainingDays);

        report.push({
          site,
          expiration: expiryDate.toISOString().split("T")[0],
          joursRestants: remainingDays,
          statut: status,
          urgence: urgency,
        });

        const threshold = notify
          ? getNotificationThreshold(site, remainingDays)
          : null;

        if (threshold !== null) {
          const emoji = threshold === 10 ? "🚨" : "⚠️";
          const message = `${emoji} **Alerte Certificat SSL**\n\n**Site:** ${site}\n**Expiration:** ${
            expiryDate.toISOString().split("T")[0]
          }\n**Jours restants:** ${remainingDays} jours\n**Urgence:** ${urgency}`;

          await sendMattermostNotification(message, "certificats-ssl");
        }
      } catch (error) {
        report.push({
          site,
          expiration: "N/A",
          joursRestants: -999,
          statut: "Erreur",
          urgence: "Critique",
          error: error instanceof Error ? error.message : "Erreur inconnue",
        });
      }
    })
  );

  return report;
}

if (process.env.APP_ENV === "production" || process.env.APP_ENV === "staging") {
  setInterval(
    () => {
      checkAndNotifyCertificates(true).catch((error) => {
        console.error("Erreur lors de la vérification des certificats:", error);
      });
    },
    24 * 60 * 60 * 1000
  );
} else {
  console.log(
    "Mode développement: vérification périodique des certificats désactivée"
  );
}

export const certificatsRoutes = new Elysia({ prefix: "/certificats" }).get(
  "/",
  async () => {
    const rapport = await checkAndNotifyCertificates(false);

    const rapportTrie = rapport.sort(
      (a, b) => a.joursRestants - b.joursRestants
    );

    return {
      date: new Date().toISOString().split("T")[0],
      certificats: rapportTrie,
    };
  }
);

export default certificatsRoutes;
