import { useState } from "react";
import { Badge } from "@dataesr/dsfr-plus";
import EditModal from "../../../components/edit-modal";
import EmailSender from "../../../components/email-sender";
import ResponseThread from "../../../components/response-thread";
import {
  BadgeColor,
  BadgeStatus,
  StatusLabel,
  TypeLabel,
  typeIcon,
} from "../../../utils";
import { CopyButton } from "../../../components/copy-button";
import { useCopyToClipboard } from "../../../hooks/useCopyToClipboard";
import "./styles.scss";
import MessagePreview from "./message-preview";
import { Contribution } from "../../../types";

type ContributionItemProps = {
  data: Contribution;
  highlightedQuery: string;
  refetch: () => void;
  allTags: string[];
};

const ContributionItem: React.FC<ContributionItemProps> = ({
  data,
  highlightedQuery,
  refetch,
  allTags,
}) => {
  const { copiedText, copyToClipboard } = useCopyToClipboard();
  const [showEditModal, setShowEditModal] = useState(false);

  const firstThread = data?.threads?.[0];
  const firstResponse = firstThread?.responses?.[0];
  const createdDate = data?.created_at
    ? new Date(data.created_at).toLocaleDateString()
    : "";

  return (
    <div className="contribution-item">
      <div className="contribution-item__header">
        <ul className="fr-badges-group fr-mb-1w">
          {data?.tags?.length > 0 && (
            <li>
              <Badge size="sm" color="green-menthe">{data.tags.join(", ")}</Badge>
            </li>
          )}
          {data?.status && (
            <li>
              <Badge size="sm" color={BadgeStatus({ status: data.status })}>
                {StatusLabel({ status: data.status })}
              </Badge>
            </li>
          )}
          {firstResponse?.team && (
            <li>
              <Badge size="sm" color="blue-ecume">{`Réponse : ${firstResponse.team}`}</Badge>
            </li>
          )}
          {data?.comment && data?.team?.length > 0 && (
            <li>
              <Badge size="sm" color="green-emeraude">{`Commenté par ${data.team[0]}`}</Badge>
            </li>
          )}
          {data?.objectType && (
            <li>
              <Badge
                size="sm"
                color={BadgeColor({ type: data.objectType })}
                icon={typeIcon({ icon: data.objectType })}
              >
                {TypeLabel({ type: data.objectType })}
              </Badge>
            </li>
          )}
        </ul>

        <div className="contribution-item__header-row">
          <h2 className="fr-h5 fr-mb-0">
            {data?.name || ""}
            <span className="fr-ml-1w fr-text--regular fr-text--sm">
              ({data?.id || ""})
              <CopyButton
                text={data?.id || ""}
                copiedText={copiedText}
                onCopy={copyToClipboard}
                ariaLabel="Copier l'identifiant"
                disabled={!data?.id}
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
        {!firstResponse && (
          <div className="fr-alert fr-alert--info fr-alert--sm fr-mb-3w">
            <p>Aucune réponse apportée à ce message pour l'instant</p>
          </div>
        )}

        <MessagePreview
          data={data}
          highlightedQuery={highlightedQuery}
        />
        <ResponseThread threads={data?.threads} contributorName={data?.name} />
        <EmailSender contribution={data} refetch={refetch} />
      </div>

      <EditModal
        refetch={refetch}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        data={data}
        allTags={allTags}
      />
    </div>
  );
};

export default ContributionItem;
