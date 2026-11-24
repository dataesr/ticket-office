export type Organisme = "DISD" | "DNE" | "HuWise";

type CertificateOwner = { gestion: Organisme; hebergement: Organisme };

const DISD: CertificateOwner = { gestion: "DISD", hebergement: "DISD" };
const DNE: CertificateOwner = { gestion: "DNE", hebergement: "DNE" };
const PAYSAGE: CertificateOwner = { gestion: "DNE", hebergement: "DISD" };
const OPENDATA: CertificateOwner = { gestion: "DNE", hebergement: "HuWise" };

export const CERTIFICATE_OWNERS: Record<string, CertificateOwner> = {
  "barometredelascienceouverte.esr.gouv.fr": DISD,
  "frenchopensciencemonitor.esr.gouv.fr": DISD,
  "bso.dataesr.ovh": DISD,
  "bso.staging.dataesr.ovh": DISD,
  "catalogue.dataesr.ovh": DNE,
  "catalogue.staging.dataesr.ovh": DNE,
  "curiexplore.dataesr.ovh": DISD,
  "curiexplore.enseignementsup-recherche.gouv.fr": DISD,
  "curiexplore.staging.dataesr.ovh": DISD,
  "datafresq.dataesr.ovh": DNE,
  "datafresq.staging.dataesr.ovh": DNE,
  "data.enseignementsup-recherche.gouv.fr": OPENDATA,
  "api.paysage.dataesr.ovh": PAYSAGE,
  "paysage-api.staging.dataesr.ovh": PAYSAGE,
  "paysage.dataesr.ovh": PAYSAGE,
  "paysage.enseignementsup-recherche.gouv.fr": PAYSAGE,
  "paysage.staging.dataesr.ovh": PAYSAGE,
  "scanr.dataesr.ovh": DISD,
  "scanr.enseignementsup-recherche.gouv.fr": DISD,
  "scanr.staging.dataesr.ovh": DISD,
  "ticket-office.dataesr.ovh": DISD,
  "ticket-office.staging.dataesr.ovh": DISD,
  "works-magnet.dataesr.ovh": DNE,
  "works-magnet.esr.gouv.fr": DNE,
  "works-magnet.staging.dataesr.ovh": DNE,
};
