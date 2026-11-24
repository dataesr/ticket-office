import { useState } from "react";
import { Alert, Button, Col, Row, Text, Title } from "@dataesr/dsfr-plus";
import EditModal from "../edit-modal";
import EmailSender from "../email-sender";
import HighlightedMessage from "../highlighted-message";
import ResponseThread from "../response-thread";
import { CopyButton } from "../copy-button";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { Contribution } from "../../types";
import ContributionBadges from "./contribution-badges";
import ContributionInfo from "./contribution-info";
import ObjectLinks from "./object-links";

type ContributionDetailProps = {
  contribution?: Contribution;
  highlightedQuery: string;
  refetch: () => void;
  allTags: string[];
  apiRoute: string;
};

const ContributionDetail = ({
  contribution,
  highlightedQuery,
  refetch,
  allTags,
  apiRoute,
}: ContributionDetailProps) => {
  const { copiedText, copyToClipboard } = useCopyToClipboard();
  const [showEditModal, setShowEditModal] = useState(false);

  const hasResponse = Boolean(contribution?.threads?.[0]?.responses?.[0]);
  const createdDate = contribution?.created_at
    ? new Date(contribution.created_at).toLocaleDateString()
    : "";

  return (
    <>
      <div className="fr-background-alt--grey fr-p-3w">
        <ContributionBadges contribution={contribution} />

        <Row verticalAlign="middle">
          <Col xs={12} md={9}>
            <Title as="h2" look="h5" className="fr-mb-0">
              {contribution?.name || ""}
              <Text as="span" size="sm" className="fr-ml-1w fr-text--regular">
                ({contribution?.id || ""})
                <CopyButton
                  text={contribution?.id || ""}
                  copiedText={copiedText}
                  onCopy={copyToClipboard}
                  ariaLabel="Copier l'identifiant"
                  disabled={!contribution?.id}
                />
              </Text>
            </Title>
            {createdDate && (
              <Text size="sm" className="fr-text-mention--grey fr-mb-0">
                Reçu le {createdDate}
              </Text>
            )}
          </Col>
          <Col xs={12} md={3}>
            <Row horizontalAlign="right">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon="edit-line"
                onClick={() => setShowEditModal(true)}
              >
                Éditer
              </Button>
            </Row>
          </Col>
        </Row>
      </div>

      <div className="fr-p-3w">
        {!hasResponse && (
          <Alert
            variant="info"
            size="sm"
            role="note"
            className="fr-mb-3w"
            description="Aucune réponse apportée à ce message pour l'instant"
          />
        )}

        <ContributionInfo contribution={contribution} />
        <ObjectLinks
          objectType={contribution?.objectType}
          objectId={contribution?.objectId}
        />
        <Row>
          <Col xs={12} md={9}>
            <div className="fr-background-alt--green-emeraude fr-p-2w fr-mb-2w">
              <HighlightedMessage
                message={contribution?.message}
                highlightedQuery={highlightedQuery}
              />
            </div>
          </Col>
        </Row>

        <ResponseThread
          threads={contribution?.threads}
          contributorName={contribution?.name}
        />
        <EmailSender
          contribution={contribution}
          refetch={refetch}
          apiRoute={apiRoute}
          collectionName={apiRoute}
        />
      </div>

      <EditModal
        refetch={refetch}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        data={contribution}
        allTags={allTags}
        apiRoute={apiRoute}
      />
    </>
  );
};

export default ContributionDetail;
