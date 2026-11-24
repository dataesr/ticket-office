import SelectWithNames from "./name-selector";
import { ExternalLinks } from "./external-links";
import { useDataList } from "../data-list-context";
import { CopyButton } from "../../../../components/copy-button";
import { useCopyToClipboard } from "../../../../hooks/useCopyToClipboard";
import { findByProductionId } from "../../../../utils/normalized-id-productions";
import { AuthorData, Contribute_Production } from "../../../../types";

type ProductionListProps = {
  contribution: Contribute_Production;
  authorsData?: Record<string, AuthorData>;
  landingPages?: Record<string, string>;
};

const ProductionList = ({
  contribution,
  authorsData = {},
  landingPages,
}: ProductionListProps) => {
  const { copiedText, copyToClipboard } = useCopyToClipboard();
  const { dataList } = useDataList();

  const isInBasket = (productionId: string) =>
    dataList.some(
      (item) =>
        item.publi_id === productionId &&
        item.contribution_id === contribution.id &&
        item.export === true
    );

  return (
    <ul className="production-request-list">
      {contribution.productions.map((production) => {
        const inBasket = isInBasket(production.id);

        return (
          <li className="production-request" key={production.id}>
            <div className="production-request__id">
              <span
                className={`fr-icon-shopping-cart-2-line production-request__cart${inBasket ? " production-request__cart--done" : ""}`}
                aria-hidden="true"
                title={inBasket ? "Ajoutée au panier" : "Pas dans le panier"}
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
                idRef={contribution.objectId}
                coloredName={contribution.name}
                contributionId={contribution.id}
                authorData={findByProductionId(production.id, authorsData)}
              />
            </div>

            <div className="production-request__links">
              <ExternalLinks
                landingPages={landingPages}
                productionId={production.id}
                name={contribution.name}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ProductionList;
