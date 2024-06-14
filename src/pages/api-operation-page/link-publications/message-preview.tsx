import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Button, Col, Container, Link, Row, Text } from "@dataesr/dsfr-plus";
import type { Contribute_Production } from "../../../types";
import EditModal from "../../../components/edit-modal";
import { useState, useCallback } from "react";
import ContributorRequests from "./contributor-requests";
import "./styles.scss";
import NameFromIdref from "../../../api/contribution-api/getNamesFromIdref";
import { useDataList } from "./data-list-context";

const MessagePreview = ({
  data,
  refetch,
}: {
  data: Contribute_Production;
  refetch: () => void;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const { setDataList } = useDataList();

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

  const handleExportAllClick = () => {
    setDataList((prevState) => {
      let addedToCart = false;
      const updatedList = prevState.map((item) => {
        if (item.person_id === data.id && !item.export) {
          addedToCart = true;
          return { ...item, export: true };
        } else {
          return item;
        }
      });

      if (addedToCart) {
        const count = updatedList.filter(
          (item) => item.person_id === data.id && item.export === true
        ).length;

        toast(
          `${count} publications de "${data.name}" ont été ajoutées au panier`,
          {
            style: {
              backgroundColor: "#4caf50",
              color: "#fff",
            },
          }
        );
      } else {
        toast.warn(
          `Les publications de "${data.name}" sont déjà dans le panier !`,
          {
            style: {
              backgroundColor: "#f57c00",
              color: "#fff",
            },
          }
        );
      }

      return updatedList;
    });
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
        {data?.id && (
          <Text
            size="sm"
            style={{ cursor: "pointer" }}
            onClick={() => copyToClipboard(data.id, "ID copié")}
            className={"fr-icon-user-line"}
          >
            ID de la personne concernée : {data.id}{" "}
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
          {fetchedData ? `${fetchedData}` : "Nom non existant sur scanR"}
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
            Email : {data.email}
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
      <Button onClick={handleExportAllClick}>Tout exporter</Button>
      <Row className="fr-mb-2w">
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
