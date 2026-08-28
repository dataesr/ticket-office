import { Button, Col, Container, Link, Row, Text } from "@dataesr/dsfr-plus";
import HighlightedMessage from "../../../components/highlighted-message";
import { useLocation } from "react-router-dom";
import EditModal from "../../../components/edit-modal";
import { useState } from "react";
import { capitalizeFirstLetter } from "../../../utils/capitalize";
import { CopyButton } from "../../../utils/copy-button";
import { useCopyToClipboard } from "../../../hooks/useCopyToClipboard";
import { MessagePreviewProps } from "../../../types";

const SCANR_URL = "https://scanr.enseignementsup-recherche.gouv.fr";
const DATAESR_URL = "http://185.161.45.213/ui";

const OBJECT_LINKS: Record<string, { scanr: string; dataesr?: string }> = {
  structures: {
    scanr: `${SCANR_URL}/entite/`,
    dataesr: `${DATAESR_URL}/organizations/`,
  },
  publications: {
    scanr: `${SCANR_URL}/publication/`,
    dataesr: `${DATAESR_URL}/publications/`,
  },
  persons: {
    scanr: `${SCANR_URL}/authors/`,
    dataesr: `${DATAESR_URL}/persons/`,
  },
  network: { scanr: `${SCANR_URL}/networks?` },
};

const MessagePreview: React.FC<MessagePreviewProps> = ({
  data,
  highlightedQuery,
  refetch,
  allTags,
}) => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const { copiedText, copyToClipboard } = useCopyToClipboard();

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
        {data?.objectType && OBJECT_LINKS[data.objectType] && (
          <Row>
            {data.objectType === "structures" && (
              <>
                <Col>
                  <Link
                    size="sm"
                    target="_blank"
                    href={`${OBJECT_LINKS.structures.scanr}${data.objectId}`}
                  >
                    Sur scanR
                  </Link>
                </Col>
                <Col>
                  <Link
                    size="sm"
                    target="_blank"
                    href={`${OBJECT_LINKS.structures.dataesr}${data.objectId}`}
                  >
                    Sur dataESR
                  </Link>
                </Col>
              </>
            )}
            {(data.objectType === "publications" ||
              data.objectType === "persons") && (
              <>
                <Link
                  size="sm"
                  target="_blank"
                  href={`${OBJECT_LINKS[data.objectType].scanr}${data.objectId}`}
                >
                  Sur scanR
                </Link>
                <br />
                <Link
                  size="sm"
                  target="_blank"
                  href={`${OBJECT_LINKS[data.objectType].dataesr}${data.objectId}`}
                >
                  Sur dataESR
                </Link>
              </>
            )}
            {data.objectType === "network" && (
              <Link
                size="sm"
                target="_blank"
                href={`${OBJECT_LINKS.network.scanr}${data.objectId}`}
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
