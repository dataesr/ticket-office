import { Button, Col, Container, Link, Row, Text } from "@dataesr/dsfr-plus";
import HighlightedMessage from "../../../components/highlighted-message";
import { useLocation } from "react-router-dom";
import EditModal from "../../../components/edit-modal";
import { useState, useCallback } from "react";
import { capitalizeFirstLetter } from "../../../utils/capitalize";
import { CopyButton } from "../../../utils/copy-button";
import { MessagePreviewProps } from "../../../types";

const MessagePreview: React.FC<MessagePreviewProps> = ({
  data,
  highlightedQuery,
  refetch,
  allTags,
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
      <Container fluid className="fr-mb-4w ">
        <Row>
          <Col>
            {data?.objectId && data?.objectType !== "network" && (
              <Text size="sm">
                ID de l'objet concerné:{" "}
                <strong>
                  {data.objectId?.length > 50
                    ? data.objectId.slice(0, 47) + "..."
                    : data.objectId}
                </strong>
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
              <Text size="sm">
                <ul>
                  {Object.entries(data.extra).map(([key, value]) => {
                    if (value === "") return null;

                    const displayKey =
                      key === "subApplication"
                        ? "Sujet"
                        : capitalizeFirstLetter(key);

                    const capitalizedValue =
                      typeof value === "string"
                        ? value.charAt(0).toUpperCase() + value.slice(1)
                        : String(value);

                    return (
                      <div key={key}>
                        <Text size="sm">
                          {displayKey}: <strong>{capitalizedValue}</strong>
                          <CopyButton
                            text={capitalizedValue}
                            copiedText={copiedText}
                            onCopy={copyToClipboard}
                          />
                        </Text>
                      </div>
                    );
                  })}
                </ul>
              </Text>
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
        {["structures", "publications", "persons", "network"].includes(
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
            {data.objectType === "network" && (
              <Link
                size="sm"
                target="_blank"
                href={`https://scanr.enseignementsup-recherche.gouv.fr/networks?${data.objectId}`}
              >
                Sur scanR
              </Link>
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
