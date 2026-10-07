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

function shouldNotifyCertificate(remainingDays: number): boolean {
  if (remainingDays <= 5) return true;
  return remainingDays === 30 || remainingDays === 10;
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
          expiration: expiryDate.toISOString().split("T")[0],
          joursRestants: remainingDays,
          site,
          statut: status,
          urgence: urgency,
        });

        if (notify && shouldNotifyCertificate(remainingDays)) {
          const expired = remainingDays < 0;
          const emoji = expired ? "🔴" : remainingDays <= 5 ? "🚨" : "⚠️";
          const joursLigne = expired
            ? `**Certificat EXPIRÉ depuis ${-remainingDays} jour(s)**`
            : `**Jours restants:** ${remainingDays} jours`;
          const message = `${emoji} **Alerte Certificat SSL**\n\n**Site:** ${site}\n**Expiration:** ${
            expiryDate.toISOString().split("T")[0]
          }\n${joursLigne}\n**Urgence:** ${urgency}`;

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

const CHECK_HOUR = 6;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function getNextCheckDate(now: Date = new Date()): Date {
  const next = new Date(now);
  next.setHours(CHECK_HOUR, 0, 0, 0);
  if (next.getTime() <= now.getTime()) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}

async function runScheduledCheck() {
  console.log("[certificats] Vérification quotidienne en cours...");
  try {
    const report = await checkAndNotifyCertificates(true);
    const alerts = report.filter(
      (certificate) =>
        !certificate.error && shouldNotifyCertificate(certificate.joursRestants)
    );
    const errors = report.filter((certificate) => certificate.error);
    console.log(
      `[certificats] ${report.length} sites vérifiés, ${alerts.length} alerte(s), ${errors.length} en erreur`
    );
  } catch (error) {
    console.error("[certificats] Échec de la vérification:", error);
  }
}

// Run once at 6 AM, then every 24 hours, server time
function scheduleCertificateChecks() {
  const nextCheck = getNextCheckDate();
  console.log(
    `[certificats] Prochaine vérification planifiée le ${nextCheck.toISOString()}`
  );
  setTimeout(() => {
    runScheduledCheck();
    setInterval(runScheduledCheck, ONE_DAY_MS);
  }, nextCheck.getTime() - Date.now());
}

export function startCertificateChecks() {
  if (process.env.APP_ENV === "production") {
    console.log("Démarrage de la vérification périodique des certificats...");
    scheduleCertificateChecks();
  } else {
    console.log(
      "Mode développement: vérification périodique des certificats désactivée"
    );
  }
}

export const certificatsRoutes = new Elysia({ prefix: "/certificats" }).get(
  "/",
  async () => {
    const rapport = await checkAndNotifyCertificates(false);
    return {
      certificates: rapport.sort((a, b) => a.joursRestants - b.joursRestants),
      date: new Date().toISOString().split("T")[0],
    };
  }
);

export default certificatsRoutes;
