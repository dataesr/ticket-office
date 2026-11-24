import { Accordion, AccordionGroup, Badge } from "@dataesr/dsfr-plus";
import EmailSender from "../../../../components/email-sender";
import ResponseThread from "../../../../components/response-thread";
import { CopyButton } from "../../../../components/copy-button";
import { useCopyToClipboard } from "../../../../hooks/useCopyToClipboard";
import { BadgeStatus, StatusLabel } from "../../../../utils";
import { AuthorData, Contribute_Production } from "../../../../types";
import ContributorActions from "./contributor-actions";
import ContributorInfo from "./contributor-info";
import ProductionList from "./production-list";

type ProductionCardProps = {
  contribution: Contribute_Production;
  refetch: () => void;
  allTags: string[];
  authorsData: Record<string, AuthorData>;
  landingPages: Record<string, string>;
  idrefNames: Record<string, string>;
};

const ProductionCard = ({
  contribution,
  refetch,
  allTags,
  authorsData,
  landingPages,
  idrefNames,
}: ProductionCardProps) => {
  const { copiedText, copyToClipboard } = useCopyToClipboard();

  const productionsCount = contribution.productions.length;
  const receivedDate = new Date(contribution.created_at).toLocaleDateString();

  const renderSummary = () => (
    <div className="production-item-summary">
      <ul className="fr-badges-group fr-mb-1w">
        {contribution.status && (
          <li>
            <Badge
              size="sm"
              color={BadgeStatus({ status: contribution.status })}
            >
              {StatusLabel({ status: contribution.status })}
            </Badge>
          </li>
        )}
        <li>
          <Badge size="sm" color="green-emeraude" icon="links-line">
            {`${productionsCount} publication${productionsCount > 1 ? "s" : ""} à lier`}
          </Badge>
        </li>
      </ul>

      <div className="production-item-summary__row">
        <p className="fr-text--sm fr-text--bold fr-mb-0">
          {contribution.name}
          <span className="fr-ml-1w fr-text--regular fr-text--sm">
            ({contribution.id})
            <CopyButton
              text={contribution.id}
              copiedText={copiedText}
              onCopy={copyToClipboard}
              ariaLabel="Copier l'identifiant"
            />
          </span>
        </p>
        <p className="fr-text--sm fr-text-mention--grey fr-mb-0">
          Reçu le {receivedDate}
        </p>
      </div>
    </div>
  );

  return (
    <AccordionGroup>
      <Accordion title={renderSummary}>
        <ContributorInfo
          contribution={contribution}
          idrefName={idrefNames[contribution.objectId] || ""}
        />
        <ContributorActions
          contribution={contribution}
          refetch={refetch}
          allTags={allTags}
        />
        <ProductionList
          contribution={contribution}
          authorsData={authorsData}
          landingPages={landingPages}
        />
        <ResponseThread
          threads={contribution.threads}
          contributorName={contribution.name}
        />
        <EmailSender
          contribution={contribution}
          refetch={refetch}
          apiRoute="production"
          collectionName="contribute_productions"
        />
      </Accordion>
    </AccordionGroup>
  );
};

export default ProductionCard;
