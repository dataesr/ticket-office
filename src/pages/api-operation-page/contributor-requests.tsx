import { Col, Row, Text } from "@dataesr/dsfr-plus";
import React, { ReactNode, useState } from "react";
import { Production } from "../../types";
import { ExternalLinks } from "./external-links";
import SelectWithNames from "./name-selector";

const ContributorRequests: React.FC<{
  data: {
    id: any;
    name: ReactNode;
    productions: Production[];
  };
  setDataList;
  coloredName;
}> = ({ data, setDataList, coloredName }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(text);
    });
  };

  return (
    <>
      {data.productions.map((production, index) => (
        <Col md="3" className="fr-mr-1v">
          <Text
            size="sm"
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "5px",
            }}
          >
            <Text size="sm" className="textInCard">
              <strong>ID :</strong>{" "}
              <span onClick={() => copyToClipboard(production.id)}>
                {production.id}
              </span>
              {copiedId === production.id && (
                <span
                  style={{
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
            </Text>
            <SelectWithNames
              productionId={production.id}
              setDataList={setDataList}
              idRef={data.id}
              coloredName={coloredName}
            />
            <Row className="fr-grid-row--center fr-mt-2w">
              <Text size="sm">
                <ExternalLinks productionId={production.id} name={data.name} />
              </Text>
            </Row>
          </Text>
        </Col>
      ))}
    </>
  );
};

export default ContributorRequests;
