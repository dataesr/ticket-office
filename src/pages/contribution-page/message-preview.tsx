import { Col, Row, Text } from "@dataesr/dsfr-plus";
import type { Contribution } from "../../types";
import HighlightedMessage from "../../components/highlightedMessage";
const MessagePreview = ({
  data,
  highlightedQuery,
}: {
  data: Contribution;
  highlightedQuery: string;
}) => {
  return (
    <>
      <Row className="contributorSide">
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
      </Row>
    </>
  );
};

export default MessagePreview;
