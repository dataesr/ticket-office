import { Button, Col, Container, Link, Row, Text } from "@dataesr/dsfr-plus";
import type { Contribution } from "../../types";
import HighlightedMessage from "../../components/highlighted-message";
import { useLocation } from "react-router-dom";
import EditModal from "../../components/edit-modal";
import { useState, useCallback } from "react";
import { FaCopy } from "react-icons/fa";

const MessagePreview = ({
  data,
  highlightedQuery,
  refetch,
  allTags,
}: {
  data: Contribution;
  highlightedQuery: string;
  refetch: () => void;
  allTags: string[];
}) => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
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
              <Text size="sm">
                ID de l'objet concerné: <strong>{data.id}</strong>
                <button
                  className={`copy-button ${
                    copiedId === data.id ? "copied" : ""
                  }`}
                  onClick={() => copyToClipboard(data.id)}
                >
                  {copiedId === data.id && (
                    <span className="copied-text">Copié</span>
                  )}
                  <FaCopy size={14} color="#2196f3" className="copy-icon" />
                </button>
              </Text>
            </Col>
          )}
          <Col>
            <Text size="sm">
              Nom: {data?.name ? <strong>{data.name}</strong> : "non renseigné"}
              {data?.name && (
                <button
                  className={`copy-button ${
                    copiedId === data.name ? "copied" : ""
                  }`}
                  onClick={() => copyToClipboard(data.name)}
                >
                  {copiedId === data.name && (
                    <span className="copied-text">Copié</span>
                  )}
                  <FaCopy size={14} color="#2196f3" className="copy-icon" />
                </button>
              )}
            </Text>
          </Col>
        </Row>
        {data?.email && (
          <Row>
            <Col>
              <Text size="sm">
                Email: <strong>{data.email}</strong>
                <button
                  className={`copy-button ${
                    copiedId === data.email ? "copied" : ""
                  }`}
                  onClick={() => copyToClipboard(data.email)}
                >
                  {copiedId === data.email && (
                    <span className="copied-text">Copié</span>
                  )}
                  <FaCopy size={14} color="#2196f3" className="copy-icon" />
                </button>
              </Text>
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            {data?.organisation ? (
              <Text size="sm">
                Organisation: <strong>{data.organisation}</strong>
                <button
                  className={`copy-button ${
                    copiedId === data.organisation ? "copied" : ""
                  }`}
                  onClick={() => copyToClipboard(data.organisation)}
                >
                  {copiedId === data.organisation && (
                    <span className="copied-text">Copié</span>
                  )}
                  <FaCopy size={14} color="#2196f3" className="copy-icon" />
                </button>
              </Text>
            ) : (
              <Text size="sm" bold>
                Organisation non renseignée
              </Text>
            )}
          </Col>
          <Col>
            {data?.fonction || data?.function ? (
              <Text size="sm">
                Fonction: <strong>{data.fonction || data.function}</strong>
                <button
                  className={`copy-button ${
                    copiedId === data.fonction || data.function ? "copied" : ""
                  }`}
                  onClick={() =>
                    copyToClipboard(data.fonction || data.function)
                  }
                >
                  {copiedId === data.fonction && (
                    <span className="copied-text">Copié</span>
                  )}
                  <FaCopy size={14} color="#2196f3" className="copy-icon" />
                </button>
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
            <Text size="sm">
              Traité par :{" "}
              <strong>
                {data?.team[0]} le{" "}
                {new Date(data.modified_at).toLocaleDateString()}
              </strong>
            </Text>
          )}
        </Col>
        <Col>
          {data?.comment && (
            <>
              <Text size="sm">
                Commentaire ({data?.team ? data.team[0] : ""}){" "}
                <strong> : {data.comment}</strong>
              </Text>
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
          allTags={allTags}
          dataProduction={[]}
        />
      </Row>
      <Row className="fr-mb-5w fr-mt-3w">
        <Button onClick={handleOpenModal}>Editer la contribution</Button>
      </Row>
    </>
  );
};

export default MessagePreview;
