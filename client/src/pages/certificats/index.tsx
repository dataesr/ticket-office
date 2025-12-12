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
                </tr>
              </thead>
              <tbody>
                {data.certificats.map((cert, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{cert.site}</strong>
                      {cert.error && (
                        <div className="fr-text fr-text--error">
                          {cert.error}
                        </div>
                      )}
                    </td>
                    <td>{cert.expiration}</td>
                    <td>
                      <span
                        className={
                          cert.joursRestants < 0
                            ? "fr-text--error"
                            : cert.joursRestants < 30
                            ? "fr-text--warning"
                            : ""
                        }
                      >
                        {cert.joursRestants < 0 ? "Expiré" : cert.joursRestants}
                      </span>
                    </td>
                    <td>{cert.statut}</td>
                    <td>
                      <Badge color={getUrgenceColor(cert.urgence)} size="sm">
                        {cert.urgence}
                      </Badge>
                    </td>
                  </tr>
                ))}
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
                        data.certificats.filter((c) => c.urgence === "Critique")
                          .length
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
                        data.certificats.filter((c) => c.urgence === "Élevée")
                          .length
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
                        data.certificats.filter((c) => c.urgence === "Moyenne")
                          .length
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
                        data.certificats.filter((c) => c.urgence === "Faible")
                          .length
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
