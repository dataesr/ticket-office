import { Col } from "@dataesr/dsfr-plus";
import React, { ReactNode, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Production } from "../../../types";
import SelectWithNames from "./name-selector";
import { ExternalLinks } from "./external-links";
import { useDataList } from "./data-list-context";

const ContributorRequests: React.FC<{
  data: {
    id: any;
    name: ReactNode;
    productions: Production[];
  };
  coloredName;
}> = ({ data, coloredName }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { dataList } = useDataList();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(text);
    });
  };

  return (
    <>
      {data.productions.map((production) => {
        return (
          <Col
            md="12"
            className="contributorProductionContent fr-mr-1v"
            key={production.id}
          >
            <div
              onClick={() => {
                copyToClipboard(production.id);
              }}
              style={{ flex: 2, marginRight: "10px" }}
            >
              ID de la publication : {production.id}
              {dataList.find((item) => item.publi_id === production.id)
                ?.export && (
                <FaShoppingCart className="fr-ml-2w" color="#21AB8E" />
              )}
            </div>
            {copiedId === production.id && (
              <span
                style={{
                  flex: 1,
                  color: "white",
                  backgroundColor: "#efcb3a",
                  marginLeft: "10px",
                  padding: "2px 5px",
                  borderRadius: "5px",
                  fontSize: "0.8em",
                }}
              >
                ID copié
              </span>
            )}
            <Col style={{ flex: 1 }}>
              <SelectWithNames
                productionId={production.id}
                idRef={data.id}
                coloredName={coloredName}
              />
            </Col>
            <Col style={{ flex: 1 }}>
              <ExternalLinks productionId={production.id} name={data.name} />
            </Col>
          </Col>
        );
      })}
    </>
  );
};

export default ContributorRequests;
