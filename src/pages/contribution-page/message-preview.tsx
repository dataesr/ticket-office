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
  refetch;
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
      <Container fluid className={contributorInfoClassName}>
        <div>
          <Row gutters>
            {data?.id && (
              <Col>
                <Text
                  bold
                  size="sm"
                  style={{ cursor: "pointer" }}
                  onClick={() => copyToClipboard(data.id, "ID copié")}
                  className={
                    data.type === "structure"
                      ? "fr-icon-building-line"
                      : "fr-icon-user-line"
                  }
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
              </Col>
            )}
            <Col>
              <Text size="sm" bold>
                {data?.name ? `Nom: ${data.name}` : "Nom non renseigné"}
              </Text>
            </Col>
          </Row>
          {data?.email && (
            <Row>
              <Col>
                <Text
                  bold
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
              </Col>
            </Row>
          )}
          <Row>
            <Col>
              {data?.organisation ? (
                <Text size="sm" bold>
                  Organisation: {data.organisation}
                </Text>
              ) : (
                <Text size="sm" bold>
                  Organisation non renseignée
                </Text>
              )}
            </Col>
            <Col>
              {data?.fonction ? (
                <Text size="sm" bold>
                  Fonction: {data.fonction}
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
            <>
              <Link
                size="sm"
                target="_blank"
                className="fr-footer__top-link"
                href={`https://scanr.enseignementsup-recherche.gouv.fr/entite/${data.id}`}
              >
                Sur scanR
              </Link>
              <br />
              <Link
                size="sm"
                target="_blank"
                className="fr-footer__top-link"
                href={`http://185.161.45.213/ui/organizations/${data.id}`}
              >
                Sur dataESR
              </Link>
            </>
          )}
          {data?.type === "publications" && (
            <>
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
            </>
          )}
          {data?.type === "persons" && (
            <div>
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
            </div>
          )}
        </div>
      </Container>
      <Row className={contributorMessageClassName}>
        <Text size="sm">
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
      <Row className="fr-mb-2w">
        <Button onClick={handleOpenModal}>Editer la contribution</Button>
      </Row>
    </>
  );
};

export default MessagePreview;
