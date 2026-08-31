import { useMemo, useState } from "react";
import ExcelJS from "exceljs";
import { toast } from "react-toastify";
import Badge from "../../components/badge";
import { useDataList } from "./data-list-context";
import "./styles.scss";
import { postHeaders } from "../../config/api";
import { ContributionData, ExcelExportButtonProps } from "../../types";

const ExcelExportButton: React.FC<ExcelExportButtonProps> = ({ refetch }) => {
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
    const basePath = window.location.pathname.includes("contributionpage")
      ? "contribute"
      : window.location.pathname.includes("apioperations")
        ? "contribute_productions"
        : "contacts";

    try {
      const responses = await Promise.all(
        [...new Set(contributionIds)].map((id) =>
          fetch(`/api/${basePath}/${id}`, {
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

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");
    worksheet.addRow(Object.keys(dataToExport[0]));
    dataToExport.forEach((row) => worksheet.addRow(Object.values(row)));

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "export.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

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
    } catch (err) {
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
      <div className="export-basket__header">
        <p className="fr-text--sm fr-text--bold fr-mb-0">
          Publications à exporter
        </p>
        <div className="export-basket__header-actions">
          <Badge color="blue-ecume">
            {`${displayItems.length} publication${displayItems.length > 1 ? "s" : ""}`}
          </Badge>
          <button
            type="button"
            className={`fr-btn fr-btn--tertiary-no-outline fr-btn--sm ${
              isMinimized
                ? "fr-icon-arrow-down-s-line"
                : "fr-icon-arrow-up-s-line"
            }`}
            onClick={() => setIsMinimized((prev) => !prev)}
            aria-expanded={!isMinimized}
            title={isMinimized ? "Déplier le panier" : "Replier le panier"}
          >
            {isMinimized ? "Déplier" : "Replier"}
          </button>
        </div>
      </div>

      {!isMinimized &&
        (displayItems.length > 0 ? (
          <ul className="export-basket__list">
            {displayItems.map((item) => (
              <li className="export-basket__item" key={item.publi_id}>
                <div className="export-basket__item-text">
                  <span className="fr-text--sm fr-text--bold fr-mb-0 export-basket__item-id">
                    {item.publi_id}
                  </span>
                  <span className="fr-text--xs fr-text-mention--grey fr-mb-0">
                    à lier à {item.fullName}
                  </span>
                </div>
                <button
                  type="button"
                  className="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-icon-delete-line"
                  onClick={() => handleRemoveClick(item.publi_id)}
                  title={`Retirer ${item.fullName} du panier`}
                >
                  Retirer
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="fr-text--sm fr-text-mention--grey export-basket__empty">
            Aucune publication dans le panier.
          </p>
        ))}

      <div className="export-basket__actions">
        <button
          type="button"
          className="fr-btn fr-btn--sm fr-icon-download-line fr-btn--icon-left"
          onClick={handleExportClick}
        >
          Exporter
        </button>
        <button
          type="button"
          className="fr-btn fr-btn--secondary fr-btn--sm fr-icon-clipboard-line fr-btn--icon-left"
          onClick={handleCopyToClipboardClick}
        >
          Copier et marquer comme traité
        </button>
        <button
          type="button"
          className="fr-btn fr-btn--tertiary fr-btn--sm fr-icon-delete-line fr-btn--icon-left"
          onClick={handleClearClick}
        >
          Vider le panier
        </button>
      </div>
    </aside>
  );
};

export default ExcelExportButton;
