import { Badge, Col, Container, Row, Text, Title } from "@dataesr/dsfr-plus";
import Loader from "../../components/loader";
import { useCertificates } from "./api";
import PageBanner from "../../components/page-banner";

const getUrgenceColor = (urgence: string) => {
  switch (urgence) {
    case "Critique":
      return "error";
    case "Élevée":
      return "warning";
    case "Moyenne":
      return "info";
    case "Faible":
      return "success";
    default:
      return "info";
  }
};

type Organisme = "DISD" | "DNE" | "HuWise";

const ORGANISME_COLORS: Record<
  Organisme,
  "blue-ecume" | "purple-glycine" | "orange-terre-battue"
> = {
  DISD: "blue-ecume",
  DNE: "purple-glycine",
  HuWise: "orange-terre-battue",
};

type CertificateOwner = { gestion: Organisme; hebergement: Organisme };

const DISD: CertificateOwner = { gestion: "DISD", hebergement: "DISD" };
const DNE: CertificateOwner = { gestion: "DNE", hebergement: "DNE" };
const PAYSAGE: CertificateOwner = { gestion: "DNE", hebergement: "DISD" };
const OPENDATA: CertificateOwner = { gestion: "DNE", hebergement: "HuWise" };

const CERTIFICATE_OWNERS: Record<string, CertificateOwner> = {
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

const OrganismeBadge = ({ organisme }: { organisme: Organisme }) => (
  <Badge color={ORGANISME_COLORS[organisme]} size="sm" noIcon>
    {organisme}
  </Badge>
);

const URGENCE_SUMMARY = [
  { urgence: "Critique", label: "Critiques" },
  { urgence: "Élevée", label: "Urgence élevée" },
  { urgence: "Moyenne", label: "Urgence moyenne" },
  { urgence: "Faible", label: "Valides" },
];

const Certificats = () => {
  const { data, isLoading, error } = useCertificates();
  return (
    <main id="content">
      <PageBanner
        title="Certificats"
        description="Surveillance de l'expiration des certificats SSL de nos applications"
      />
      <Container className="fr-mt-5w">
        {isLoading && <Loader />}

        {error && (
          <div className="fr-callout fr-callout--error">
            <Title as="h3" className="fr-callout__title">
              Erreur
            </Title>
            <Text className="fr-callout__text">{error.message}</Text>
          </div>
        )}

        {data && !isLoading && !error && (
          <>
            <div className="fr-callout fr-callout--info fr-mb-3w">
              <Text className="fr-callout__text--xs">
                Rapport généré le{" "}
                {new Date(data.date).toLocaleDateString("fr-FR")}
              </Text>
            </div>

            <div className="stat-table">
              <table className="fr-table">
                <thead>
                  <tr>
                    <th>Site</th>
                    <th>Date d'expiration</th>
                    <th>Jours restants</th>
                    <th>Statut</th>
                    <th>Urgence</th>
                    <th>Gestion</th>
                    <th>Hébergement</th>
                  </tr>
                </thead>
                <tbody>
                  {data.certificates.map((certificate, index) => {
                    const owner = CERTIFICATE_OWNERS[certificate.site];
                    return (
                      <tr key={index}>
                        <td>
                          <strong>{certificate.site}</strong>
                          {certificate.error && (
                            <Text className="fr-text--error fr-mb-0">
                              {certificate.error}
                            </Text>
                          )}
                        </td>
                        <td>{certificate.expiration}</td>
                        <td>
                          <Text
                            as="span"
                            className={
                              certificate.joursRestants <= 5
                                ? "fr-text--error"
                                : certificate.joursRestants <= 30
                                  ? "fr-text--warning"
                                  : ""
                            }
                          >
                            {certificate.joursRestants < 0
                              ? "Expiré"
                              : certificate.joursRestants}
                          </Text>
                        </td>
                        <td>{certificate.statut}</td>
                        <td>
                          <Badge
                            color={getUrgenceColor(certificate.urgence)}
                            size="sm"
                          >
                            {certificate.urgence}
                          </Badge>
                        </td>
                        <td>
                          {owner ? (
                            <OrganismeBadge organisme={owner.gestion} />
                          ) : (
                            "Non renseigné"
                          )}
                        </td>
                        <td>
                          {owner ? (
                            <OrganismeBadge organisme={owner.hebergement} />
                          ) : (
                            "Non renseigné"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Row gutters className="fr-mt-3w">
              {URGENCE_SUMMARY.map(({ urgence, label }) => (
                <Col xs="12" md="3" key={urgence}>
                  <div className="fr-card fr-card--sm">
                    <div className="fr-card__body">
                      <div className="fr-card__content">
                        <Title as="h3" className="fr-card__title">
                          {
                            data.certificates.filter(
                              (certificate) => certificate.urgence === urgence
                            ).length
                          }
                        </Title>
                        <Text className="fr-card__desc">{label}</Text>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </main>
  );
};

export default Certificats;
