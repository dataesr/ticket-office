import { Button, Col, Container, Link, Row, Text } from "@dataesr/dsfr-plus";
import type { Contribute_Production } from "../../../types";
import EditModal from "../../../components/edit-modal";
import { useState, useCallback } from "react";
import ContributorRequests from "./contributor-requests";
import "./styles.scss";
import NameFromIdref from "../../../api/contribution-api/getNamesFromIdref";

const MessagePreview = ({
  data,
  refetch,
}: {
  data: Contribute_Production;
  refetch;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  const { fullNameFromIdref: fetchedData } = NameFromIdref(data.id);

  const copyToClipboard = useCallback((text, successMessage) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(successMessage);
      setTimeout(() => setCopySuccess(""), 2000);
    });
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <Container fluid>
      {data.comment && (
        <Row className="fr-grid-row--center">
          <Col md="8" className="comment">
            <Text size="sm">
              Commentaire ({data?.team ? data.team[0] : ""})
            </Text>{" "}
            <Text size="sm">{data.comment}</Text>
          </Col>
        </Row>
      )}
      <EditModal
        refetch={refetch}
        isOpen={showModal}
        onClose={handleCloseModal}
        data={data}
      />
      <Row className="contributorProductionSideInfo">
        {data.id && (
          <Text
            size="sm"
            style={{ cursor: "pointer" }}
            onClick={() => copyToClipboard(data.id, "ID copié")}
            className={"fr-icon-user-line"}
          >
            ID de la personne concerné: {data.id}{" "}
            {copySuccess === "ID copié" && (
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
                {copySuccess}
              </span>
            )}
          </Text>
        )}
        <Link
          className="fr-footer__content-link"
          target="_blank"
          rel="noreferrer noopener external"
          href={`https://www.idref.fr/${data.id.replace("idref", "")}`}
        >
          IdRef
        </Link>
        <Text
          size="sm"
          bold
          style={{
            cursor: "pointer",
            color: fetchedData ? "inherit" : "#f95c5e",
          }}
          onClick={() => copyToClipboard(fetchedData, "Nom copié")}
        >
          {fetchedData ? `${fetchedData}` : "Nom non-inéxistant sur scanR"}
          {copySuccess === "Nom copié" && (
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
              Copié !
            </span>
          )}
        </Text>
        <Text size="sm">
          {"Nom lié à l'idref "}
          <span style={{ fontWeight: "bold" }}>{data.name}</span>
        </Text>

        {data.email && (
          <Text
            size="sm"
            style={{ cursor: "pointer" }}
            onClick={() => copyToClipboard(data.email, "Email copié")}
          >
            Email: {data.email}
            {copySuccess === "Email copié" && (
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
                {copySuccess}
              </span>
            )}
          </Text>
        )}
      </Row>
      <Row>
        <Col className="contributorProductionSide">
          <ContributorRequests data={data} coloredName={data.name} />
        </Col>
      </Row>
      <Row className="fr-mb-2w">
        <Button onClick={handleOpenModal}>Editer la contribution</Button>
      </Row>
    </Container>
  );
};

export default MessagePreview;
