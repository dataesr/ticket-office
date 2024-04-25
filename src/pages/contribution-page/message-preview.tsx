import { Col, Row, Text } from "@dataesr/dsfr-plus";
import type { Contribution } from "../../types";
import HighlightedMessage from "../../components/highlightedMessage";
import { useLocation } from "react-router-dom";
const MessagePreview = ({
  data,
  highlightedQuery,
}: {
  data: Contribution;
  highlightedQuery: string;
}) => {
  const location = useLocation();
  const contributorClassName = location.pathname.includes("contributionpage")
    ? "contributorSide"
    : "contributorSideContact";
  return (
    <>
      <Row className={contributorClassName}>
        {data.id && (
          <Col
            className={
              data.type === "structure"
                ? "fr-icon-building-line"
                : "fr-icon-user-line"
            }
          >
            ID de l'objet concerné : {data.id}
          </Col>
        )}
        <Col>
          <Text>{data.name ? `Nom: ${data.name}` : "Nom non renseigné"}</Text>
          {data.email && <Text>Email: {data.email}</Text>}
        </Col>
        <Col className="contributorInfo">
          {data.organisation && <Text>Organisation: {data.organisation}</Text>}
          {data.fonction && <Text>Fonction: {data.fonction}</Text>}
          <Text>Reçu le {new Date(data.created_at).toLocaleDateString()}</Text>
        </Col>
        <span>
          <HighlightedMessage
            message={data.message}
            highlightedQuery={highlightedQuery}
          />
        </span>
        <div>
          <pre>{JSON.stringify(data || "", null, 2)}</pre>
        </div>
      </Row>
    </>
  );
};

export default MessagePreview;
