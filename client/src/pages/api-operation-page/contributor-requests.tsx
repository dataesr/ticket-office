import { useState } from "react";
import { FaShoppingCart, FaCopy } from "react-icons/fa";
import SelectWithNames from "./name-selector";
import { ExternalLinks } from "./external-links";
import { useDataList } from "./data-list-context";
import { Col } from "@dataesr/dsfr-plus";
import "./styles.scss";
import { findAuthorData } from "../../utils/normalized-id-productions";
import { ContributorRequestsProps } from "../../types";

const ContributorRequests: React.FC<ContributorRequestsProps> = ({
  data,
  coloredName,
  authorsData = {},
  landingPages,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { dataList } = useDataList();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(text);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    });
  };

  const isExported = (publicationId: string, contributionId: string) => {
    return dataList.some(
      (item) =>
        item.publi_id === publicationId &&
        item.contribution_id === contributionId &&
        item.export === true
    );
  };

  return (
    <>
      {data?.productions.map((production) => {
        const isCopied = copiedId === production?.id;

        const hasExport = isExported(production.id, data.id);

        const currentAuthorData = findAuthorData(production?.id, authorsData);

        return (
          <Col
            md="12"
            className="contributorProductionContent fr-mr-1v"
            key={production?.id}
            style={{ position: "relative" }}
            xs="12"
          >
            <div style={{ flex: 2, display: "flex", alignItems: "center" }}>
              ID de la publication : {production.id}
              <button
                className={`copy-button ${isCopied ? "copied" : ""}`}
                onClick={() => {
                  copyToClipboard(production.id);
                }}
              >
                {isCopied && <span className="copied-text">Copié</span>}
                <FaCopy size={14} color="#2196f3" className="copy-icon" />
              </button>
              {!hasExport && (
                <FaShoppingCart
                  className="fr-ml-2w cart-icon red-cart"
                  color="red"
                />
              )}
              {hasExport && (
                <FaShoppingCart
                  className="fr-ml-2w cart-icon"
                  color="#21AB8E"
                />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <SelectWithNames
                productionId={production.id}
                idRef={data.objectId}
                coloredName={coloredName}
                contributionId={data.id}
                authorData={currentAuthorData}
              />
            </div>
            <div style={{ flex: 1 }}>
              <ExternalLinks
                landingPages={landingPages}
                productionId={production.id}
                name={data.name}
              />
            </div>
          </Col>
        );
      })}
    </>
  );
};

export default ContributorRequests;
