import { Elysia } from "elysia";
import * as tls from "tls";
import { sendMattermostNotification } from "../../utils/sendMattermostNotification";

interface CertificateReport {
  site: string;
  expiration: string;
  joursRestants: number;
  statut: string;
  urgence: "Critique" | "Élevée" | "Moyenne" | "Faible";
  error?: string;
}

const SITES = [
  "paysage.enseignementsup-recherche.gouv.fr",
  "bso.dataesr.ovh",
  "scanr.enseignementsup-recherche.gouv.fr",
  "scanr.dataesr.ovh",
  "paysage.dataesr.ovh",
  "barometredelascienceouverte.esr.gouv.fr",
  "paysage.staging.dataesr.ovh",
  "works-magnet.esr.gouv.fr",
  "data.esr.gouv.fr",
  "data.enseignementsup-recherche.gouv.fr",
  "curiexplore.enseignementsup-recherche.gouv.fr",
  "cluster-production.elasticsearch.dataesr.ovh",
  "piwik.enseignementsup-recherche.pro",
  "publication.enseignementsup-recherche.gouv.fr",
];

async function getSSLExpiryDate(hostname: string): Promise<Date> {
  return new Promise((resolve, reject) => {
    const options = {
      host: hostname,
      port: 443,
      servername: hostname,
      rejectUnauthorized: false,
    };

    const socket = tls.connect(options, () => {
      const cert = socket.getPeerCertificate();
      socket.end();

      if (!cert || !cert.valid_to) {
        reject(new Error("Impossible de récupérer le certificat"));
        return;
      }

      resolve(new Date(cert.valid_to));
    });

    socket.on("error", (error) => {
      reject(error);
    });

    socket.setTimeout(5000, () => {
      socket.destroy();
      reject(new Error("Timeout"));
    });
  });
}

function calculateRemainingDays(expirationDate: Date): number {
  const today = new Date();
  const diffTime = expirationDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function generateStatusAndUrgency(remainingDays: number): {
  status: string;
  urgency: "Critique" | "Élevée" | "Moyenne" | "Faible";
} {
  if (remainingDays < 0) {
    return {
      status: "Expiré",
      urgency: "Critique",
    };
  } else if (remainingDays < 30) {
    return {
      status: `Expire dans ${remainingDays} jours`,
      urgency: "Critique",
    };
  } else if (remainingDays < 60) {
    return {
      status: `Expire dans ${remainingDays} jours`,
      urgency: "Élevée",
    };
  } else if (remainingDays < 90) {
    return {
      status: `Expire dans ${remainingDays} jours`,
      urgency: "Moyenne",
    };
  } else {
    const months = Math.floor(remainingDays / 30);
    return {
      status: `Valide (${months} mois)`,
      urgency: "Faible",
    };
  }
}

async function checkAndNotifyCertificates() {
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

        if (remainingDays === 20 || remainingDays === 10) {
          const emoji =
            remainingDays === 10 ? "🚨" : remainingDays === 20 ? "⚠️" : "🔔";
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

export const certificatsRoutes = new Elysia({ prefix: "/certificats" }).get(
  "/",
  async () => {
    const rapport = await checkAndNotifyCertificates();

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
