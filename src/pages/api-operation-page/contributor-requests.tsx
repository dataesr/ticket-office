import { Col, Link, Text } from "@dataesr/dsfr-plus";
import React, { useState } from "react";
import { Production } from "../../types";

const ContributorRequests: React.FC<{
  data: { productions: Production[] };
}> = ({ data }) => {
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
            <Text className="textInCard" size="sm">
              <Link
                className="fr-mr-1w"
                target="_blank"
                rel="noreferrer noopener external"
                href={`https://scanr.enseignementsup-recherche.gouv.fr/publication/${production.id}`}
              >
                scanR
              </Link>
              <Link
                className="fr-mr-1w"
                target="_blank"
                rel="noreferrer noopener external"
                href={`https://paysage.enseignementsup-recherche.gouv.fr/`}
              >
                Paysage
              </Link>
              <Link
                target="_blank"
                rel="noreferrer noopener external"
                href={`https://paysage.enseignementsup-recherche.gouv.fr/`}
              >
                dataESR
              </Link>
            </Text>
          </Text>
        </Col>
      ))}
    </>
  );
};

export default ContributorRequests;
