import { Col, Row, Text } from "@dataesr/dsfr-plus";
import type { Contribution } from "../../types";
const MessagePreview = ({
  data,
  highlightedQuery,
}: {
  data: Contribution;
  highlightedQuery: string;
}) => {
  const renderHighlightedMessage = () => {
    console.log(highlightedQuery);
    if (!highlightedQuery) return data?.message;

    const lowerCaseMessage = data?.message?.toLowerCase();
    const lowerCaseQuery = highlightedQuery?.toLowerCase();
    const index = lowerCaseMessage.indexOf(lowerCaseQuery);
    if (index === -1) return data?.message;

    const prefix = data?.message.substring(0, index);
    const highlight = data?.message.substring(
      index,
      index + highlightedQuery?.length
    );
    const suffix = data?.message?.substring(index + highlightedQuery?.length);

    return (
      <>
        {prefix}
        <span style={{ backgroundColor: "yellow" }}>{highlight}</span>
        {suffix}
      </>
    );
  };

  return (
    <Row className="contributorSide">
      <>
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
      </>
      <Text>Message: {renderHighlightedMessage()}</Text>
    </Row>
  );
};

export default MessagePreview;
