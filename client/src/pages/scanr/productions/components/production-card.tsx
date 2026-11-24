import {
  Accordion,
  AccordionGroup,
  Badge,
  BadgeGroup,
  Text,
} from "@dataesr/dsfr-plus";
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
      <BadgeGroup className="fr-mb-1w">
        {contribution.status && (
          <Badge size="sm" color={BadgeStatus({ status: contribution.status })}>
            {StatusLabel({ status: contribution.status })}
          </Badge>
        )}
        <Badge size="sm" color="green-emeraude" icon="links-line">
          {`${productionsCount} publication${productionsCount > 1 ? "s" : ""} à lier`}
        </Badge>
      </BadgeGroup>

      <div className="production-item-summary__row">
        <Text size="sm" className="fr-text--bold fr-mb-0">
          {contribution.name}
          <Text as="span" size="sm" className="fr-ml-1w fr-text--regular">
            ({contribution.id})
            <CopyButton
              text={contribution.id}
              copiedText={copiedText}
              onCopy={copyToClipboard}
              ariaLabel="Copier l'identifiant"
            />
          </Text>
        </Text>
        <Text size="sm" className="fr-text-mention--grey fr-mb-0">
          Reçu le {receivedDate}
        </Text>
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
