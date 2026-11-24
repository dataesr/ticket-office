import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Badge, Button, ButtonGroup, Col, Row, Text } from "@dataesr/dsfr-plus";
import { useDataList } from "../data-list-context";
import { postHeaders } from "../../../../config/api";
import { ContributionData } from "../../../../types";
import { downloadXlsx } from "../utils";

type ExportBasketProps = { refetch: () => void };

const ExportBasket = ({ refetch }: ExportBasketProps) => {
  const { dataList, setDataList } = useDataList();
  const [isMinimized, setIsMinimized] = useState(false);

  const exportItems = useMemo(
    () => dataList.filter((item) => item.export === true),
    [dataList]
  );

  const displayItems = useMemo(() => {
    const seen = new Map<string, (typeof exportItems)[number]>();
    exportItems.forEach((item) => {
      if (!seen.has(item.publi_id)) seen.set(item.publi_id, item);
    });
    return [...seen.values()].sort((a, b) =>
      a.fullName.localeCompare(b.fullName)
    );
  }, [exportItems]);

  const resetExports = () =>
    setDataList((prevState) =>
      prevState.map((item) => ({ ...item, export: false }))
    );

  const markAsTreated = async (contributionIds: string[]) => {
    try {
      const responses = await Promise.all(
        [...new Set(contributionIds)].map((id) =>
          fetch(`/api/production/${id}`, {
            method: "PATCH",
            headers: postHeaders,
            body: JSON.stringify({ status: "treated" }),
          })
        )
      );

      responses
        .filter((response) => !response.ok)
        .forEach((response) => console.error("Erreur de réponse", response));

      refetch();
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire", error);
    }
  };

  const handleExportClick = async () => {
    const dataToExport: ContributionData[] = exportItems.map((item) => ({
      person_id: item.person_id || "",
      publi_id: item.publi_id || "",
      contribution_id: item.contribution_id || "",
      fullName: item.fullName || "",
      first_name: item.first_name || "",
      last_name: item.last_name || "",
      export: false,
    }));

    if (dataToExport.length === 0) {
      toast.error("Aucune publication à exporter !");
      return;
    }

    await markAsTreated(dataToExport.map((item) => item.contribution_id));

    await downloadXlsx(dataToExport);

    resetExports();
    toast("Panier vidé après exportation !", {
      style: { backgroundColor: "#c3fad5" },
    });
  };

  const handleCopyToClipboardClick = async () => {
    if (exportItems.length === 0) {
      toast.error("Aucune publication à copier !");
      return;
    }

    const formattedData = exportItems
      .map((item) =>
        [
          item.person_id || "",
          item.publi_id || "",
          item.fullName || "",
          item.first_name || "",
          item.last_name || "",
        ].join("\t")
      )
      .join("\n");

    try {
      await navigator.clipboard.writeText(formattedData);
      toast.success("Données copiées dans le presse-papiers !");
    } catch {
      toast.error("Erreur lors de la copie des données !");
    }

    await markAsTreated(exportItems.map((item) => item.contribution_id));

    resetExports();
    toast("Panier vidé après la copie !", {
      style: { backgroundColor: "#c3fad5" },
    });
  };

  const handleRemoveClick = (publiId: string) => {
    const removedItem = exportItems.find((item) => item.publi_id === publiId);
    setDataList((prevState) =>
      prevState.map((item) =>
        item.export === true && item.publi_id === publiId
          ? { ...item, export: false }
          : item
      )
    );
    if (removedItem) {
      toast(`Élément retiré ! : ${removedItem.fullName}`, {
        style: { backgroundColor: "#d64d00", color: "#fff" },
      });
    }
  };

  const handleClearClick = () => {
    resetExports();
    toast("Panier vidé !", { style: { backgroundColor: "#c3fad5" } });
  };

  return (
    <aside
      className="export-basket"
      aria-label="Panier des publications à exporter"
    >
      <Row verticalAlign="middle" className="fr-background-alt--grey fr-p-2w">
        <Col>
          <Text size="sm" className="fr-text--bold fr-mb-0">
            Publications à exporter
          </Text>
          <Badge size="sm" color="blue-ecume">
            {`${displayItems.length} publication${displayItems.length > 1 ? "s" : ""}`}
          </Badge>
        </Col>
        <Button
          type="button"
          variant="text"
          size="sm"
          icon={isMinimized ? "arrow-down-s-line" : "arrow-up-s-line"}
          onClick={() => setIsMinimized((prev) => !prev)}
          aria-expanded={!isMinimized}
          aria-label={isMinimized ? "Déplier le panier" : "Replier le panier"}
          title={isMinimized ? "Déplier le panier" : "Replier le panier"}
        />
      </Row>

      {!isMinimized &&
        (displayItems.length > 0 ? (
          <ul className="fr-raw-list">
            {displayItems.map((item) => (
              <li className="fr-px-2w fr-py-1w" key={item.publi_id}>
                <Text size="sm" className="fr-text--bold fr-mb-0">
                  {item.publi_id}
                  <Button
                    type="button"
                    variant="text"
                    size="sm"
                    icon="delete-line"
                    onClick={() => handleRemoveClick(item.publi_id)}
                    aria-label={`Retirer ${item.fullName} du panier`}
                    title={`Retirer ${item.fullName} du panier`}
                  />
                </Text>
                <Text size="xs" className="fr-text-mention--grey fr-mb-0">
                  à lier à {item.fullName}
                </Text>
              </li>
            ))}
          </ul>
        ) : (
          <Text size="sm" className="fr-text-mention--grey fr-p-2w fr-m-0">
            Aucune publication dans le panier.
          </Text>
        ))}

      <div className="fr-px-3w fr-pt-2w">
        <ButtonGroup size="sm">
          <Button
            type="button"
            icon="download-line"
            iconPosition="left"
            onClick={handleExportClick}
          >
            Exporter
          </Button>
          <Button
            type="button"
            variant="secondary"
            icon="clipboard-line"
            iconPosition="left"
            onClick={handleCopyToClipboardClick}
          >
            Copier et marquer comme traité
          </Button>
          <Button
            type="button"
            variant="tertiary"
            icon="delete-line"
            iconPosition="left"
            onClick={handleClearClick}
          >
            Vider le panier
          </Button>
        </ButtonGroup>
      </div>
    </aside>
  );
};

export default ExportBasket;
