import * as tls from "tls";

export interface CertificateReport {
  site: string;
  expiration: string;
  joursRestants: number;
  statut: string;
  urgence: "Critique" | "Élevée" | "Moyenne" | "Faible";
  error?: string;
}

export const getSSLExpiryDate = async (hostname: string): Promise<Date> => {
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
};

export const calculateRemainingDays = (expirationDate: Date): number => {
  const today = new Date();
  const diffTime = expirationDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const generateStatusAndUrgency = (
  remainingDays: number
): {
  status: string;
  urgency: "Critique" | "Élevée" | "Moyenne" | "Faible";
} => {
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
};
