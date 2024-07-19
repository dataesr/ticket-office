import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Link,
  Row,
  Text,
} from "@dataesr/dsfr-plus";
import type { Contribute_Production } from "../../../types";
import EditModal from "../../../components/edit-modal";
import { useState, useCallback } from "react";
import ContributorRequests from "./contributor-requests";
import "./styles.scss";
import NameFromIdref from "../../../api/contribution-api/getNamesFromIdref";
import { useDataList } from "./data-list-context";
import { FaCopy } from "react-icons/fa";

const MessagePreview = ({
  data,
  refetch,
  allTags,
}: {
  data: Contribute_Production;
  refetch: () => void;
  allTags: string[];
}) => {
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [idRefClicked, setIdRefClicked] = useState(false);
  const [scanRClicked, setScanRClicked] = useState(false);

  const { dataList, setDataList } = useDataList();

  const { fullNameFromIdref: fetchedData } = NameFromIdref(data.id);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
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
        const count = dataList.filter((item) => item.export === true).length;

        const message =
          count === 1
            ? `La publication de "${data.name}" a été ajoutée au panier`
            : `Les publications de "${data.name}" ont été ajoutées au panier`;

        toast(message, {
          style: {
            backgroundColor: "#4caf50",
            color: "#fff",
          },
        });
      } else {
        toast.warn(
          `Les publications de "${data.name}" sont déjà dans le panier ! Ou bien, le nom est différent de celui de la contribution. Veuillez vérifier, puis les entrer à la main`,
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
  const formattedProductionId = data.id.replace(/\//g, "%2f");

  return (
    <Container fluid>
      {data.comment && (
        <Row className="fr-grid-row--center">
          <Col md="8" className="comment">
            <Text size="sm">
              Commentaire ({data?.team ? data.team[0] : ""}){" "}
              <strong> : {data.comment}</strong>
            </Text>
          </Col>
        </Row>
      )}
      <EditModal
        refetch={refetch}
        isOpen={showModal}
        onClose={handleCloseModal}
        data={data}
        allTags={allTags}
        dataProduction={[]}
      />
      <Row className="contributorProductionSideInfo">
        {data?.id && (
          <Text
            size="sm"
            style={{ cursor: "pointer" }}
            className="fr-icon-user-line"
          >
            ID de la personne concernée : {data.id}{" "}
            <button
              className={`copy-button ${copiedId === data.id ? "copied" : ""}`}
              onClick={() => copyToClipboard(data.id)}
            >
              {copiedId === data.id && (
                <span className="copied-text">Copié</span>
              )}
              <FaCopy size={14} color="#2196f3" className="copy-icon" />
            </button>
          </Text>
        )}
        {data?.id && (
          <Link
            className={`fr-footer__content-link ${
              idRefClicked ? "clicked-link" : ""
            }`}
            target="_blank"
            rel="noreferrer noopener external"
            href={`https://www.idref.fr/${data.id.replace("idref", "")}`}
            onClick={() => setIdRefClicked(true)}
          >
            IdRef
          </Link>
        )}
        {data?.id && (
          <Link
            className={`fr-footer__content-link ${
              scanRClicked ? "clicked-link" : ""
            }`}
            target="_blank"
            rel="noreferrer noopener external"
            href={`https://scanr.enseignementsup-recherche.gouv.fr/authors/${formattedProductionId}`}
            onClick={() => setScanRClicked(true)}
          >
            scanR
          </Link>
        )}
        <Text
          size="sm"
          bold
          style={{
            cursor: "pointer",
            color: fetchedData ? "inherit" : "#f95c5e",
          }}
        >
          {fetchedData ? `${fetchedData}` : "Nom non existant sur scanR"}
          <button
            className={`copy-button ${
              fetchedData === data.name ? "copied" : ""
            }`}
            onClick={() => copyToClipboard(fetchedData)}
          >
            {copiedId === fetchedData && (
              <span className="copied-text">Copié</span>
            )}
            <FaCopy size={14} color="#2196f3" className="copy-icon" />
          </button>{" "}
        </Text>
        <Text size="sm">
          {"Nom lié à l'idref "}
          <span style={{ fontWeight: "bold" }}>{data.name}</span>
        </Text>
        {data.email && (
          <Text size="sm" style={{ cursor: "pointer" }}>
            Email : {data.email}
            <button
              className={`copy-button ${
                copiedId === data.email ? "copied" : ""
              }`}
              onClick={() => copyToClipboard(data.email)}
            >
              {copiedId === data.email && (
                <span className="copied-text">Copié</span>
              )}
              <FaCopy size={14} color="#2196f3" className="copy-icon" />
            </button>
          </Text>
        )}
      </Row>
      <ButtonGroup isInlineFrom="xs" size="sm">
        <Button onClick={handleOpenModal}>Editer la contribution</Button>
        <Button onClick={handleExportAllClick}>Tout exporter</Button>
      </ButtonGroup>
      <Row className="fr-mb-2w">
        <Col className="contributorProductionSide">
          <ContributorRequests data={data} coloredName={data.name} />
        </Col>
      </Row>
    </Container>
  );
};

export default MessagePreview;
