import Badge from "../../../components/badge";
import StaffActions from "./staff-actions";
import {
  BadgeColor,
  BadgeStatus,
  StatusLabel,
  TypeLabel,
  typeIcon,
} from "../../../utils";
import { CopyButton } from "../../../utils/copy-button";
import { useCopyToClipboard } from "../../../hooks/useCopyToClipboard";
import "./styles.scss";
import MessagePreview from "./message-preview";
import { Contribution } from "../../../types";

type ContributionItemProps = {
  data: Contribution;
  highlightedQuery: string;
  refetch: () => void;
  allTags: string[];
  url: string;
};

const ContributionItem: React.FC<ContributionItemProps> = ({
  data,
  highlightedQuery,
  refetch,
  allTags,
  url,
}) => {
  const { copiedText, copyToClipboard } = useCopyToClipboard();

  const firstThread = data?.threads?.[0];
  const firstResponse = firstThread?.responses?.[0];
  const createdDate = data?.created_at
    ? new Date(data.created_at).toLocaleDateString()
    : "";

  return (
    <div className="contribution-item-container">
      <ul className="fr-badges-group fr-mb-3w">
        {data?.tags?.length > 0 && (
          <li>
            <Badge color="green-menthe">{data.tags.join(", ")}</Badge>
          </li>
        )}
        {data?.status && (
          <li>
            <Badge color={BadgeStatus({ status: data.status })}>
              {StatusLabel({ status: data.status })}
            </Badge>
          </li>
        )}
        {firstResponse?.team && (
          <li>
            <Badge color="blue-ecume">{`Réponse : ${firstResponse.team}`}</Badge>
          </li>
        )}
        {data?.comment && data?.team?.length > 0 && (
          <li>
            <Badge color="green-emeraude">{`Commenté par ${data.team[0]}`}</Badge>
          </li>
        )}
        {data?.objectType && (
          <li>
            <Badge
              color={BadgeColor({ type: data.objectType })}
              icon={typeIcon({ icon: data.objectType })}
            >
              {TypeLabel({ type: data.objectType })}
            </Badge>
          </li>
        )}
      </ul>

      <div className="fr-grid-row fr-grid-row--gutters fr-mb-2w">
        <div className="fr-col-12 fr-col-md-8">
          <h2 className="fr-h5 fr-mb-1w">
            {data?.name || ""}
            <span className="fr-ml-1w fr-text--regular">
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

          {!firstResponse && (
            <div className="fr-alert fr-alert--info fr-alert--sm fr-mb-2w">
              <p>Aucune réponse apportée à ce message pour l'instant</p>
            </div>
          )}
        </div>
        <div className="fr-col-12 fr-col-md-4 fr-text--right">
          {createdDate && (
            <p className="fr-text--sm fr-text-mention--grey fr-mb-0">
              <i>Reçu le {createdDate}</i>
            </p>
          )}
        </div>
      </div>

      <MessagePreview
        data={data}
        allTags={allTags}
        refetch={refetch}
        highlightedQuery={highlightedQuery}
      />
      <StaffActions url={url} refetch={refetch} data={data} />
    </div>
  );
};

export default ContributionItem;
