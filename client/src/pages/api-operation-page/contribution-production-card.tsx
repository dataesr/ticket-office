import { Accordion, AccordionGroup } from "@dataesr/dsfr-plus";
import "./styles.scss";
import Badge from "../../components/badge";
import StaffProductionActions from "./staff-production-action";
import { BadgeStatus, StatusLabel } from "../../utils/index";
import { CopyButton } from "../../utils/copy-button";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import MessagePreview from "./message-preview";
import { ContributionProductionItemProps } from "../../types";

const ContributionProductionItem: React.FC<ContributionProductionItemProps> = ({
  data,
  refetch,
  allTags,
  authorsData,
  landingPages,
}) => {
  const { copiedText, copyToClipboard } = useCopyToClipboard();

  const productionsCount = data.productions.length;
  const receivedDate = new Date(data.created_at).toLocaleDateString();

  const renderAccordion = () => (
    <div className="production-item-summary">
      <ul className="fr-badges-group fr-mb-1w">
        {data?.status && (
          <li>
            <Badge color={BadgeStatus({ status: data?.status })}>
              {StatusLabel({ status: data.status })}
            </Badge>
          </li>
        )}
        {data.tag && (
          <li>
            <Badge color="green-menthe">{data.tag}</Badge>
          </li>
        )}
        <li>
          <Badge color="green-emeraude" icon="links-line">
            {`${productionsCount} publication${productionsCount > 1 ? "s" : ""} à lier`}
          </Badge>
        </li>
      </ul>

      <div className="production-item-summary__row">
        <p className="fr-text--sm fr-text--bold fr-mb-0">
          {data?.name}
          <span className="fr-ml-1w fr-text--regular fr-text--sm">
            ({data?.id})
            <CopyButton
              text={data?.id}
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
      <Accordion title={renderAccordion}>
        <MessagePreview
          authorsData={authorsData}
          allTags={allTags}
          data={{
            ...data,
            email: data.email || "",
            message: data.message || "",
            status: data.status || "",
          }}
          refetch={refetch}
          landingPages={landingPages}
        />
        <StaffProductionActions data={data} refetch={refetch} />
      </Accordion>
    </AccordionGroup>
  );
};

export default ContributionProductionItem;
