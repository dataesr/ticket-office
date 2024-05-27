import { Button, Col, Row, Text } from "@dataesr/dsfr-plus";
import type { Contribution } from "../../types";
import HighlightedMessage from "../../components/highlighted-message";
import { useLocation } from "react-router-dom";
import EditModal from "../../components/edit-modal";
import { useState, useCallback } from "react";

const MessagePreview = ({
  data,
  highlightedQuery,
}: {
  data: Contribution;
  highlightedQuery: string;
}) => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  const copyToClipboard = useCallback((text, successMessage) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(successMessage);
      setTimeout(() => setCopySuccess(""), 2000);
    });
  }, []);

  const contributorInfoClassName = location.pathname.includes(
    "contributionpage"
  )
    ? "contributorSideInfo"
    : "contributorSideContactInfo";
  const handleOpenModal = () => {
    setShowModal(true);
  };
  const contributorMessageClassName = location.pathname.includes(
    "contributionpage"
  )
    ? "contributorSideMessage"
    : "contributorSideContactMessage";

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <EditModal isOpen={showModal} onClose={handleCloseModal} data={data} />
      <Row className={contributorInfoClassName}>
        {data.id && (
          <Col
            md="4"
            className={
              data.type === "structure"
                ? "fr-icon-building-line"
                : "fr-icon-user-line"
            }
          >
            <Text
              size="sm"
              style={{ cursor: "pointer" }}
              onClick={() => copyToClipboard(data.id, "ID copié")}
            >
              ID de l'objet concerné: {data.id}
              {copySuccess === "ID copié" && (
                <span
                  style={{
                    color: "white",
                    backgroundColor: "#efcb3a",
                    marginLeft: "10px",
                    padding: "2px 5px",
                    borderRadius: "5px",
                    fontSize: "0.8em",
                  }}
                >
                  {copySuccess}
                </span>
              )}
            </Text>
            {data.team && data.team.length > 0 && (
              <Text size="sm">
                Traité par : {data?.team[0]} le{" "}
                {new Date(data.modified_at).toLocaleDateString()}
              </Text>
            )}
          </Col>
        )}
        <Col md="4">
          <Text size="sm">
            {data.name ? `Nom: ${data.name}` : "Nom non renseigné"}
          </Text>
          {data.email && (
            <Text
              size="sm"
              style={{ cursor: "pointer" }}
              onClick={() => copyToClipboard(data.email, "Email copié")}
            >
              Email: {data.email}
              {copySuccess === "Email copié" && (
                <span
                  style={{
                    color: "white",
                    backgroundColor: "#efcb3a",
                    marginLeft: "10px",
                    padding: "2px 5px",
                    borderRadius: "5px",
                    fontSize: "0.8em",
                  }}
                >
                  {copySuccess}
                </span>
              )}
            </Text>
          )}
        </Col>
        <Col md="4" className="contributorInfo">
          {data.organisation ? (
            <Text size="sm">Organisation: {data.organisation}</Text>
          ) : (
            <Text size="sm">Organisation non renseignée</Text>
          )}
          {data.fonction ? (
            <Text size="sm">Fonction: {data.fonction}</Text>
          ) : (
            <Text>Fonction non renseignée</Text>
          )}
        </Col>
      </Row>
      <Row className={contributorMessageClassName}>
        <Text size="sm">
          <HighlightedMessage
            message={data.message}
            highlightedQuery={highlightedQuery}
          />
        </Text>
      </Row>
      <Row className="fr-mb-2w">
        <Button onClick={handleOpenModal}>Editer la contribution</Button>
      </Row>
    </>
  );
};

export default MessagePreview;
