import { Button, Col, Row, Text } from "@dataesr/dsfr-plus";
import type { Contribution } from "../../types";
import HighlightedMessage from "../../components/highlighted-message";
import { useLocation } from "react-router-dom";
import EditModal from "../../components/edit-modal";
import { useState } from "react";
const MessagePreview = ({
  data,
  highlightedQuery,
}: {
  data: Contribution;
  highlightedQuery: string;
}) => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  const contributorClassName = location.pathname.includes("contributionpage")
    ? "contributorSide"
    : "contributorSideContact";
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <EditModal isOpen={showModal} onClose={handleCloseModal} data={data} />
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
      <Button onClick={handleOpenModal}>Editer la contribution</Button>
    </>
  );
};

export default MessagePreview;
