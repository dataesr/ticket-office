import { Col, Row, Text, Title } from "@dataesr/dsfr-plus";
import { Certificate } from "../api";

const URGENCE_LABELS = [
  { urgence: "Critique", label: "Critiques" },
  { urgence: "Élevée", label: "Urgence élevée" },
  { urgence: "Moyenne", label: "Urgence moyenne" },
  { urgence: "Faible", label: "Valides" },
];

type UrgenceSummaryProps = { certificates: Certificate[] };

const UrgenceSummary = ({ certificates }: UrgenceSummaryProps) => (
  <Row gutters>
    {URGENCE_LABELS.map(({ urgence, label }) => (
      <Col xs="12" md="3" key={urgence}>
        <div className="fr-card fr-card--sm">
          <div className="fr-card__body">
            <div className="fr-card__content">
              <Title as="h2" look="h3" className="fr-card__title">
                {
                  certificates.filter(
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
);

export default UrgenceSummary;
