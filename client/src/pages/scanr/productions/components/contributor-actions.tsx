import { useState } from "react";
import { toast } from "react-toastify";
import { Button, ButtonGroup, Col, Row } from "@dataesr/dsfr-plus";
import EditModal from "../../../../components/edit-modal";
import { useDataList } from "../data-list-context";
import { Contribute_Production } from "../../../../types";

type ContributorActionsProps = {
  contribution: Contribute_Production;
  refetch: () => void;
  allTags: string[];
};

const ContributorActions = ({
  contribution,
  refetch,
  allTags,
}: ContributorActionsProps) => {
  const [showModal, setShowModal] = useState(false);
  const [idRefClicked, setIdRefClicked] = useState(false);
  const [scanRClicked, setScanRClicked] = useState(false);
  const { dataList, setDataList } = useDataList();

  const handleExportAllClick = () => {
    const isToAdd = (item: (typeof dataList)[number]) =>
      item.person_id === contribution.objectId && !item.export;
    const addedCount = dataList.filter(isToAdd).length;

    if (addedCount === 0) {
      toast.warn(
        `Les publications de "${contribution.name}" sont déjà dans le panier ! Ou bien, le nom est différent de celui de la contribution. Veuillez vérifier, puis les entrer à la main`,
        { style: { backgroundColor: "#f57c00", color: "#fff" } }
      );
      return;
    }

    setDataList((prevState) =>
      prevState.map((item) =>
        isToAdd(item) ? { ...item, export: true } : item
      )
    );
    toast(
      addedCount === 1
        ? `La publication de "${contribution.name}" a été ajoutée au panier`
        : `Les publications de "${contribution.name}" ont été ajoutées au panier`,
      { style: { backgroundColor: "#4caf50", color: "#fff" } }
    );
  };

  return (
    <>
      <Row gutters verticalAlign="middle" className="fr-mb-1w">
        <Col xs={12} md={6}>
          {contribution.id && (
            <ButtonGroup isInlineFrom="xs">
              <Button
                as="a"
                variant="tertiary"
                size="sm"
                icon={idRefClicked ? "check-line" : "external-link-line"}
                iconPosition="left"
                target="_blank"
                rel="noreferrer noopener external"
                href={`https://www.idref.fr/${contribution.objectId.replace("idref", "")}`}
                onClick={() => setIdRefClicked(true)}
              >
                Sur IdRef
              </Button>
              <Button
                as="a"
                variant="tertiary"
                size="sm"
                icon={scanRClicked ? "check-line" : "external-link-line"}
                iconPosition="left"
                target="_blank"
                rel="noreferrer noopener external"
                href={`https://scanr.enseignementsup-recherche.gouv.fr/authors/${contribution.objectId.replace(/\//g, "%2f")}`}
                onClick={() => setScanRClicked(true)}
              >
                Sur scanR
              </Button>
            </ButtonGroup>
          )}
        </Col>
        <Col xs={12} md={6}>
          <Row horizontalAlign="right">
            <ButtonGroup isInlineFrom="xs">
              <Button
                type="button"
                size="sm"
                icon="download-line"
                iconPosition="left"
                onClick={handleExportAllClick}
              >
                Tout exporter
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon="edit-line"
                iconPosition="left"
                onClick={() => setShowModal(true)}
              >
                Éditer la contribution
              </Button>
            </ButtonGroup>
          </Row>
        </Col>
      </Row>

      <EditModal
        refetch={refetch}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={contribution}
        allTags={allTags}
        apiRoute="production"
      />
    </>
  );
};

export default ContributorActions;
