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
      <Row gutters className={contributorClassName}>
        {data.id && (
          <Col
            className={
              data.type === "structure"
                ? "fr-icon-building-line"
                : "fr-icon-user-line"
            }
          >
            ID de l'objet concerné : {data.id}
            {data.team && data.team.length > 0 && (
              <Text>
                Traité par : {data?.team[0]} le{" "}
                {new Date(data.modified_at).toLocaleDateString()}
              </Text>
            )}
          </Col>
        )}

        <Col>
          <Text>{data.name ? `Nom: ${data.name}` : "Nom non renseigné"}</Text>
          {data.email && <Text>Email: {data.email}</Text>}
        </Col>
        <Col className="contributorInfo">
          {data.organisation ? (
            <Text>Organisation: {data.organisation}</Text>
          ) : (
            <Text>Organisation non renseignée</Text>
          )}
          {data.fonction ? (
            <Text>Fonction: {data.fonction}</Text>
          ) : (
            <Text>Fonction non renseignée</Text>
          )}

          {data.team && data.team.length > 0 ? (
            <Text>
              Traité par : {data.team[0]} le{" "}
              {new Date(data.modified_at).toLocaleDateString()}
            </Text>
          ) : (
            <Text>Non traité</Text>
          )}
        </Col>
        <Col>
          <Text>
            <HighlightedMessage
              message={data.message}
              highlightedQuery={highlightedQuery}
            />
          </Text>
          <div>
            <pre>{JSON.stringify(data || "", null, 2)}</pre>
          </div>
          <Button onClick={handleOpenModal}>Editer la contribution</Button>
        </Col>
      </Row>
    </>
  );
};

export default MessagePreview;
