import { useState } from "react";
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
    <div className="contribution-item">
      <div className="contribution-item__header">
        <ContributionBadges contribution={contribution} />

        <div className="contribution-item__header-row">
          <h2 className="fr-h5 fr-mb-0">
            {contribution?.name || ""}
            <span className="fr-ml-1w fr-text--regular fr-text--sm">
              ({contribution?.id || ""})
              <CopyButton
                text={contribution?.id || ""}
                copiedText={copiedText}
                onCopy={copyToClipboard}
                ariaLabel="Copier l'identifiant"
                disabled={!contribution?.id}
              />
            </span>
          </h2>
          <div className="contribution-item__actions">
            <button
              type="button"
              className="fr-btn fr-btn--secondary fr-btn--sm fr-icon-edit-line fr-btn--icon-left"
              onClick={() => setShowEditModal(true)}
            >
              Éditer
            </button>
            {createdDate && (
              <p className="fr-text--sm fr-text-mention--grey fr-mb-0 contribution-item__date">
                Reçu le {createdDate}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="contribution-item__body">
        {!hasResponse && (
          <div className="fr-alert fr-alert--info fr-alert--sm fr-mb-3w">
            <p>Aucune réponse apportée à ce message pour l'instant</p>
          </div>
        )}

        <ContributionInfo contribution={contribution} />
        <ObjectLinks
          objectType={contribution?.objectType}
          objectId={contribution?.objectId}
        />
        <div className="contributorSideMessage fr-mb-3w">
          <HighlightedMessage
            message={contribution?.message}
            highlightedQuery={highlightedQuery}
          />
        </div>

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
    </div>
  );
};

export default ContributionDetail;
