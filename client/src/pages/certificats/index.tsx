import { Container, Title, Row, Col, Badge } from "@dataesr/dsfr-plus";
import { useCertificates } from "./api";

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

console.log(CERTIFICATE_OWNERS, "coucou");

const Certificats = () => {
  const { data, isLoading, error } = useCertificates();
  return (
    <Container className="fr-mt-5w">
      <div className="fr-mb-3w">
        <Title look="h3">Certificats SSL</Title>
        <p className="fr-text--sm">
          Surveillance de l'expiration des certificats SSL de nos applications
        </p>
      </div>

      {isLoading && (
        <div className="fr-callout fr-callout--info">
          <p className="fr-callout__text">Chargement des certificats...</p>
        </div>
      )}

      {error && (
        <div className="fr-callout fr-callout--error">
          <h3 className="fr-callout__title">Erreur</h3>
          <p className="fr-callout__text">{error.message}</p>
        </div>
      )}

      {data && !isLoading && !error && (
        <>
          <div className="fr-callout fr-callout--info fr-mb-3w">
            <p className="fr-callout__text--xs">
              Rapport généré le{" "}
              {new Date(data.date).toLocaleDateString("fr-FR")}
            </p>
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
                          <div className="fr-text fr-text--error">
                            {certificate.error}
                          </div>
                        )}
                      </td>
                      <td>{certificate.expiration}</td>
                      <td>
                        <span
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
                        </span>
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
            <Col xs="12" md="3">
              <div className="fr-card fr-card--sm">
                <div className="fr-card__body">
                  <div className="fr-card__content">
                    <h3 className="fr-card__title">
                      {
                        data.certificates.filter(
                          (certificate) => certificate.urgence === "Critique"
                        ).length
                      }
                    </h3>
                    <p className="fr-card__desc">Critiques</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs="12" md="3">
              <div className="fr-card fr-card--sm">
                <div className="fr-card__body">
                  <div className="fr-card__content">
                    <h3 className="fr-card__title">
                      {
                        data.certificates.filter(
                          (certificate) => certificate.urgence === "Élevée"
                        ).length
                      }
                    </h3>
                    <p className="fr-card__desc">Urgence élevée</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs="12" md="3">
              <div className="fr-card fr-card--sm">
                <div className="fr-card__body">
                  <div className="fr-card__content">
                    <h3 className="fr-card__title">
                      {
                        data.certificates.filter(
                          (certificate) => certificate.urgence === "Moyenne"
                        ).length
                      }
                    </h3>
                    <p className="fr-card__desc">Urgence moyenne</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs="12" md="3">
              <div className="fr-card fr-card--sm">
                <div className="fr-card__body">
                  <div className="fr-card__content">
                    <h3 className="fr-card__title">
                      {
                        data.certificates.filter(
                          (certificate) => certificate.urgence === "Faible"
                        ).length
                      }
                    </h3>
                    <p className="fr-card__desc">Valides</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Certificats;
