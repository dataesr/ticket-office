import {
  Accordion,
  AccordionGroup,
  Badge,
  BadgeGroup,
  Text,
} from "@dataesr/dsfr-plus";
import EmailSender from "../../../../components/email-sender";
import ResponseThread from "../../../../components/response-thread";
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
  const productionsCount = contribution.productions.length;
  const receivedDate = new Date(contribution.created_at).toLocaleDateString();

  const title = (
    <>
      {contribution.name}
      <Text
        as="span"
        size="sm"
        className="fr-text--regular fr-text-mention--grey fr-ml-1w"
      >
        Reçu le {receivedDate}
      </Text>
    </>
  );

  return (
    <div className="fr-mb-3w">
      <BadgeGroup>
        {contribution.status && (
          <Badge size="sm" color={BadgeStatus({ status: contribution.status })}>
            {StatusLabel({ status: contribution.status })}
          </Badge>
        )}
        <Badge size="sm" color="green-emeraude" icon="links-line">
          {`${productionsCount} publication${productionsCount > 1 ? "s" : ""} à lier`}
        </Badge>
      </BadgeGroup>
      <AccordionGroup>
        <Accordion title={title}>
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
    </div>
  );
};

export default ProductionCard;
