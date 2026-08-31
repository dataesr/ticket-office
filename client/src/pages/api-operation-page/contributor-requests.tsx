import SelectWithNames from "./name-selector";
import { ExternalLinks } from "./external-links";
import { useDataList } from "./data-list-context";
import { CopyButton } from "../../utils/copy-button";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import "./styles.scss";
import { findAuthorData } from "../../utils/normalized-id-productions";
import { ContributorRequestsProps } from "../../types";

const ContributorRequests: React.FC<ContributorRequestsProps> = ({
  data,
  coloredName,
  authorsData = {},
  landingPages,
}) => {
  const { copiedText, copyToClipboard } = useCopyToClipboard();
  const { dataList } = useDataList();

  const isExported = (publicationId: string, contributionId: string) =>
    dataList.some(
      (item) =>
        item.publi_id === publicationId &&
        item.contribution_id === contributionId &&
        item.export === true
    );

  return (
    <ul className="production-request-list">
      {data?.productions.map((production) => {
        const hasExport = isExported(production.id, data.id);
        const currentAuthorData = findAuthorData(production?.id, authorsData);

        return (
          <li className="production-request" key={production?.id}>
            <div className="production-request__id">
              <span
                className={`fr-icon-shopping-cart-2-line production-request__cart${hasExport ? " production-request__cart--done" : ""}`}
                aria-hidden="true"
                title={hasExport ? "Ajoutée au panier" : "Pas dans le panier"}
              />
              <div className="production-request__id-text">
                <span className="fr-text--xs fr-text-mention--grey fr-mb-0">
                  ID de la publication
                </span>
                <span className="fr-text--sm fr-mb-0 production-request__id-value">
                  <span className="production-request__id-code">
                    {production.id}
                  </span>
                  <CopyButton
                    text={production.id}
                    copiedText={copiedText}
                    onCopy={copyToClipboard}
                    ariaLabel="Copier l'identifiant de la publication"
                  />
                </span>
              </div>
            </div>

            <div className="production-request__select">
              <SelectWithNames
                productionId={production.id}
                idRef={data.objectId}
                coloredName={coloredName}
                contributionId={data.id}
                authorData={currentAuthorData}
              />
            </div>

            <div className="production-request__links">
              <ExternalLinks
                landingPages={landingPages}
                productionId={production.id}
                name={data.name}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ContributorRequests;
