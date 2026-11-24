import { Col, Row, Text } from "@dataesr/dsfr-plus";
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
    <ul className="fr-raw-list">
      {contribution.productions.map((production) => {
        const inBasket = isInBasket(production.id);

        return (
          <li className="fr-py-1w" key={production.id}>
            <Row gutters verticalAlign="middle">
              <Col xs={12} md={5}>
                <Text size="xs" className="fr-text-mention--grey fr-mb-0">
                  <span
                    className={`fr-icon-shopping-cart-2-line fr-icon--sm fr-mr-1v ${inBasket ? "fr-text-default--success" : "fr-text-default--error"}`}
                    aria-hidden="true"
                  />
                  ID de la publication
                  <span className="fr-sr-only">
                    {inBasket ? " (dans le panier)" : " (pas dans le panier)"}
                  </span>
                </Text>
                <Text size="sm" className="fr-mb-0">
                  {production.id}
                  <CopyButton
                    text={production.id}
                    copiedText={copiedText}
                    onCopy={copyToClipboard}
                    ariaLabel="Copier l'identifiant de la publication"
                  />
                </Text>
              </Col>
              <Col xs={12} md={4}>
                <SelectWithNames
                  productionId={production.id}
                  idRef={contribution.objectId}
                  coloredName={contribution.name}
                  contributionId={contribution.id}
                  authorData={findByProductionId(production.id, authorsData)}
                />
              </Col>
              <Col xs={12} md={3}>
                <ExternalLinks
                  landingPages={landingPages}
                  productionId={production.id}
                  name={contribution.name}
                />
              </Col>
            </Row>
          </li>
        );
      })}
    </ul>
  );
};

export default ProductionList;
