import { Button, Col, Container, Row, Text } from "@dataesr/dsfr-plus";
import type { Contribute_Production } from "../../types";
import EditModal from "../../components/edit-modal";
import { useState, useCallback } from "react";
import ContributorRequests from "./contributor-requests";
import "./styles.scss";

const MessagePreview = ({ data }: { data: Contribute_Production }) => {
  const [showModal, setShowModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  const copyToClipboard = useCallback((text, successMessage) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(successMessage);
      setTimeout(() => setCopySuccess(""), 2000);
    });
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <Container fluid>
      {data.comment && (
        <Row className="fr-grid-row--center">
          <Col md="8" className="comment">
            <Text size="sm">Commentaire de l'équipe ({data.team[0]}) </Text>
            <Text size="sm">{data.comment}</Text>
          </Col>
        </Row>
      )}
      <EditModal isOpen={showModal} onClose={handleCloseModal} data={data} />
      <Row className="contributorProductionSideInfo">
        {data.id && (
          <Text
            className="fr-mr-2w"
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
        )}
        <Text className="fr-mr-2w" size="sm">
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
      </Row>
      <Row>
        <Col className="contributorProductionSide">
          <ContributorRequests data={data} />
        </Col>
      </Row>
      <Row className="fr-mb-2w">
        <Button onClick={handleOpenModal}>Editer la contribution</Button>
      </Row>
    </Container>
  );
};

export default MessagePreview;
