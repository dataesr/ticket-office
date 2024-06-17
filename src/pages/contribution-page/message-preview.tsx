import { Button, Col, Container, Link, Row, Text } from "@dataesr/dsfr-plus";
import type { Contribution } from "../../types";
import HighlightedMessage from "../../components/highlighted-message";
import { useLocation } from "react-router-dom";
import EditModal from "../../components/edit-modal";
import { useState, useCallback } from "react";

const MessagePreview = ({
  data,
  highlightedQuery,
  refetch,
}: {
  data: Contribution;
  highlightedQuery: string;
  refetch: () => void;
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

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const contributorMessageClassName = location.pathname.includes(
    "contributionpage"
  )
    ? "contributorSideMessage"
    : "contributorSideContactMessage";

  return (
    <>
      <Container fluid className="fr-mb-4w">
        <Row>
          {data?.id && (
            <Col>
              <Text
                size="sm"
                style={{ cursor: "pointer" }}
                onClick={() => copyToClipboard(data.id, "ID copié")}
                className={
                  data.type === "structure"
                    ? "fr-icon-building-line"
                    : "fr-icon-user-line"
                }
              >
                ID de l'objet concerné: <strong>{data.id}</strong>
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
            </Col>
          )}
          <Col>
            <Text size="sm">
              Nom: {data?.name ? <strong>{data.name}</strong> : "non renseigné"}
            </Text>
          </Col>
        </Row>
        {data?.email && (
          <Row>
            <Col>
              <Text
                size="sm"
                style={{ cursor: "pointer" }}
                onClick={() => copyToClipboard(data.email, "Email copié")}
              >
                Email: <strong>{data.email}</strong>
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
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            {data?.organisation ? (
              <Text size="sm">
                Organisation: <strong>{data.organisation}</strong>
              </Text>
            ) : (
              <Text size="sm" bold>
                Organisation non renseignée
              </Text>
            )}
          </Col>
          <Col>
            {data?.fonction ? (
              <Text size="sm">
                Fonction: <strong>{data.fonction}</strong>
              </Text>
            ) : (
              <Text size="sm" bold>
                Fonction non renseignée
              </Text>
            )}
          </Col>
        </Row>
        <Col>
          {data?.team && data?.team?.length > 0 && (
            <Text size="sm" bold>
              Traité par : {data?.team[0]} le{" "}
              {new Date(data.modified_at).toLocaleDateString()}
            </Text>
          )}
        </Col>
        <Col>
          {data?.comment && (
            <>
              <Text size="sm" bold>
                Commentaire ({data?.team ? data.team[0] : ""}){" "}
              </Text>
              <Text size="sm">{data?.comment}</Text>
            </>
          )}
        </Col>
        {data?.type === "structures" && (
          <Row>
            <Col>
              <Link
                size="sm"
                target="_blank"
                className="fr-footer__top-link"
                href={`https://scanr.enseignementsup-recherche.gouv.fr/entite/${data.id}`}
              >
                Sur scanR
              </Link>
            </Col>
            <Col>
              <Link
                size="sm"
                target="_blank"
                className="fr-footer__top-link"
                href={`http://185.161.45.213/ui/organizations/${data.id}`}
              >
                Sur dataESR
              </Link>
            </Col>
          </Row>
        )}
        {data?.type === "publications" && (
          <Row>
            <Link
              size="sm"
              target="_blank"
              className="fr-footer__top-link"
              href={`https://scanr.enseignementsup-recherche.gouv.fr/publication/${data.id}`}
            >
              Sur scanR
            </Link>
            <br />
            <Link
              size="sm"
              target="_blank"
              className="fr-footer__top-link"
              href={`http://185.161.45.213/ui/publications/${data.id}`}
            >
              Sur dataESR
            </Link>
          </Row>
        )}
        {data?.type === "persons" && (
          <Row>
            <Link
              size="sm"
              target="_blank"
              className="fr-footer__top-link"
              href={`https://scanr.enseignementsup-recherche.gouv.fr/authors/${data.id}`}
            >
              Sur scanR
            </Link>
            <br />
            <Link
              size="sm"
              target="_blank"
              className="fr-footer__top-link"
              href={`http://185.161.45.213/ui/persons/${data.id}`}
            >
              Sur dataEsr
            </Link>
          </Row>
        )}
      </Container>
      <Row className={contributorMessageClassName}>
        <Text className="fr-mt-3w">
          <HighlightedMessage
            message={data?.message}
            highlightedQuery={highlightedQuery}
          />
        </Text>
        <EditModal
          refetch={refetch}
          isOpen={showModal}
          onClose={handleCloseModal}
          data={data}
        />
      </Row>
      <Row className="fr-mb-5w fr-mt-3w">
        <Button onClick={handleOpenModal}>Editer la contribution</Button>
      </Row>
    </>
  );
};

export default MessagePreview;
