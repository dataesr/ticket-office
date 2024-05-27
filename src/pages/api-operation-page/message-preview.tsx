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
      <EditModal
        isOpen={showModal}
        onClose={handleCloseModal}
        data-production={data}
        data={{
          responseByMail: "",
          responseFrom: "",
          modified_at: "",
          team: undefined,
          _id: undefined,
          status: "",
          tags: undefined,
          message: "",
          created_at: "",
          fonction: undefined,
          organisation: undefined,
          email: undefined,
          name: undefined,
          type: "",
          id: "",
          comment: "",
          data: [],
          meta: {
            total: 0,
          },
          highlightedQuery: "",
        }}
      />
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
