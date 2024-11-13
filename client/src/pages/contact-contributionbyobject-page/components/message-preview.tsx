import { Button, Col, Container, Link, Row, Text } from "@dataesr/dsfr-plus";
import type { Contribution } from "../../../types";
import HighlightedMessage from "../../../components/highlighted-message";
import { useLocation } from "react-router-dom";
import EditModal from "../../../components/edit-modal";
import { useState, useCallback } from "react";
import { capitalizeFirstLetter } from "../../../utils/capitalize";
import { CopyButton } from "../../../utils/copy-button";

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
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    });
  }, []);

  const contributorMessageClassName = location.pathname.includes(
    "contributionpage"
  )
    ? "contributorSideMessage"
    : "contributorSideContactMessage";

  return (
    <>
      <Container fluid className="fr-mb-4w">
        <Row>
          <Col>
            {data?.objectId && (
              <Text size="sm">
                ID de l'objet concerné: <strong>{data.objectId}</strong>
                <CopyButton
                  text={data.objectId}
                  copiedText={copiedText}
                  onCopy={copyToClipboard}
                />
              </Text>
            )}
            <Text size="sm">
              Nom: {data?.name ? <strong>{data.name}</strong> : "non renseigné"}
              {data?.name && (
                <CopyButton
                  text={data.name}
                  copiedText={copiedText}
                  onCopy={copyToClipboard}
                />
              )}
            </Text>
            {data?.email && (
              <Text size="sm">
                Email: <strong>{data?.email}</strong>
                <CopyButton
                  text={data.email}
                  copiedText={copiedText}
                  onCopy={copyToClipboard}
                />
              </Text>
            )}
          </Col>
          <Col>
            {data?.extra && (
              <Col>
                <ul>
                  {Object.entries(data.extra).map(([key, value]) => (
                    <div key={key}>
                      <Text size="sm">
                        {capitalizeFirstLetter(key)}:{" "}
                        <strong>{value as string}</strong>
                        <CopyButton
                          text={value as string}
                          copiedText={copiedText}
                          onCopy={copyToClipboard}
                        />
                      </Text>
                    </div>
                  ))}
                </ul>
              </Col>
            )}
          </Col>
        </Row>
        <Col>
          {data?.team?.length > 0 && (
            <Text size="sm">
              Traité par :{" "}
              <strong>
                {data.team[0]} le{" "}
                {new Date(data.treated_at).toLocaleDateString()} à{" "}
                {new Date(data.treated_at).toLocaleTimeString()}
              </strong>
            </Text>
          )}
        </Col>
        <Col>
          {data?.comment && (
            <Text size="sm">
              Commentaire ({data.team ? data.team[0] : ""}){" "}
              <strong>: {data.comment}</strong>
            </Text>
          )}
        </Col>
        {["structures", "publications", "persons"].includes(
          data?.objectType
        ) && (
          <Row>
            {data.objectType === "structures" && (
              <>
                <Col>
                  <Link
                    size="sm"
                    target="_blank"
                    href={`https://scanr.enseignementsup-recherche.gouv.fr/entite/${data.objectId}`}
                  >
                    Sur scanR
                  </Link>
                </Col>
                <Col>
                  <Link
                    size="sm"
                    target="_blank"
                    href={`http://185.161.45.213/ui/organizations/${data.objectId}`}
                  >
                    Sur dataESR
                  </Link>
                </Col>
              </>
            )}
            {data.objectType === "publications" && (
              <>
                <Link
                  size="sm"
                  target="_blank"
                  href={`https://scanr.enseignementsup-recherche.gouv.fr/publication/${data.objectId}`}
                >
                  Sur scanR
                </Link>
                <br />
                <Link
                  size="sm"
                  target="_blank"
                  href={`http://185.161.45.213/ui/publications/${data.objectId}`}
                >
                  Sur dataESR
                </Link>
              </>
            )}
            {data.objectType === "persons" && (
              <>
                <Link
                  size="sm"
                  target="_blank"
                  href={`https://scanr.enseignementsup-recherche.gouv.fr/authors/${data.objectId}`}
                >
                  Sur scanR
                </Link>
                <br />
                <Link
                  size="sm"
                  target="_blank"
                  href={`http://185.161.45.213/ui/persons/${data.objectId}`}
                >
                  Sur dataESR
                </Link>
              </>
            )}
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
          onClose={() => setShowModal(false)}
          data={data}
          allTags={allTags}
          dataProduction={[]}
        />
      </Row>
      <Row className="fr-mb-5w fr-mt-3w">
        <Button onClick={() => setShowModal(true)}>
          Éditer la contribution
        </Button>
      </Row>
    </>
  );
};

export default MessagePreview;
