import { Col } from "@dataesr/dsfr-plus";
import React, { useState } from "react";
import { FaShoppingCart, FaCopy } from "react-icons/fa";
import { Production } from "../../../types";
import SelectWithNames from "./name-selector";
import { ExternalLinks } from "./external-links";
import { useDataList } from "./data-list-context";
import "./styles.scss"; // Importez vos styles CSS ou SCSS

const ContributorRequests: React.FC<{
  data: {
    id: any;
    name: string;
    productions: Production[];
  };
  coloredName: string;
}> = ({ data, coloredName }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { dataList } = useDataList();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(text);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000); // Efface l'ID copié après 2 secondes
    });
  };

  return (
    <>
      {data.productions.map((production) => {
        const isCopied = copiedId === production.id;

        return (
          <Col
            md="12"
            className="contributorProductionContent fr-mr-1v"
            key={production.id}
            style={{ position: "relative" }}
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
              {dataList.find((item) => item.publi_id === production.id)
                ?.export && (
                <FaShoppingCart
                  className="fr-ml-2w cart-icon"
                  color="#21AB8E"
                />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <SelectWithNames
                productionId={production.id}
                idRef={data.id}
                coloredName={coloredName}
              />
            </div>
            <div style={{ flex: 1 }}>
              <ExternalLinks productionId={production.id} name={data.name} />
            </div>
          </Col>
        );
      })}
    </>
  );
};

export default ContributorRequests;
