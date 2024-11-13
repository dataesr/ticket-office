import { Key, useState } from "react";
import { Badge, Button, ButtonGroup, Text, Title } from "@dataesr/dsfr-plus";
import * as XLSX from "xlsx";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { useDataList } from "./data-list-context";
import "./styles.scss";
import { postHeaders } from "../../../config/api";

interface ExcelExportButtonProps {
  refetch: () => void;
}

const ExcelExportButton: React.FC<ExcelExportButtonProps> = ({ refetch }) => {
  const { dataList, setDataList } = useDataList();
  const [isMinimized, setIsMinimized] = useState(false);
  const markAsTreated = async (
    contributionIds: any[] | Iterable<unknown> | null | undefined
  ) => {
    const basePath = window.location.pathname.includes("contributionpage")
      ? "contribute"
      : window.location.pathname.includes("apioperations")
      ? "contribute_productions"
      : "contacts";

    const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
    const urlBase = isDevelopment
      ? `http://localhost:3000/api/${basePath}`
      : `${window.location.origin}/api/${basePath}`;

    const body = { status: "treated" };

    try {
      const uniqueContributionIds = [...new Set(contributionIds)];
      const uniqueContributionPromises = uniqueContributionIds.map((id) =>
        fetch(`${urlBase}/${id}`, {
          method: "PATCH",
          headers: postHeaders,
          body: JSON.stringify(body),
        })
      );

      const responses = await Promise.all(uniqueContributionPromises);

      responses.forEach(async (response) => {
        if (!response.ok) {
          console.error("Erreur de réponse", response);
        } else {
          const responseData = await response.json();
          console.log("Données de réponse", responseData);
        }
      });

      refetch();
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire", error);
    }
  };

  const handleExportClick = async () => {
    const dataToExport = dataList
      .filter((item) => item.export === true)
      .map((item) => ({
        person_id: item.person_id || "",
        publi_id: item.publi_id || "",
        contribution_id: item.contribution_id || "",
        full_name: item.fullName || "",
        first_name: item.first_name || "",
        last_name: item.last_name || "",
      }));

    if (dataToExport.length === 0) {
      toast.error("Aucune publication à exporter !");
      return;
    }

    const uniqueContributionIds = [
      ...new Set(dataToExport.map((item) => item.contribution_id)),
    ];

    await markAsTreated(uniqueContributionIds);

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "export.xlsx");

    setDataList((prevState) =>
      prevState.map((item) => ({ ...item, export: false }))
    );
    toast("Panier vidé après exportation !", {
      style: {
        backgroundColor: "#c3fad5",
      },
    });
  };

  const handleCopyToClipboardClick = async () => {
    const dataToCopy = dataList
      .filter((item) => item.export === true)
      .map((item) => ({
        person_id: item.person_id || "",
        publi_id: item.publi_id || "",
        contribution_id: item.contribution_id || "",
        full_name: item.fullName || "",
        first_name: item.first_name || "",
        last_name: item.last_name || "",
      }));

    if (dataToCopy.length === 0) {
      toast.error("Aucune publication à copier !");
      return;
    }

    const uniqueContributionIds = [
      ...new Set(dataToCopy.map((item) => item.contribution_id)),
    ];

    const formattedData = dataToCopy
      .map(
        (item) =>
          `${item.person_id}\t${item.publi_id}\t${item.full_name}\t${item.first_name}\t${item.last_name}`
      )
      .join("\n");

    try {
      await navigator.clipboard.writeText(formattedData);
      toast.success("Données copiées dans le presse-papiers !");
    } catch (err) {
      toast.error("Erreur lors de la copie des données !");
    }

    await markAsTreated(uniqueContributionIds);

    setDataList((prevState) =>
      prevState.map((item) => ({ ...item, export: false }))
    );
    toast("Panier vidé après la copie !", {
      style: {
        backgroundColor: "#c3fad5",
      },
    });
  };

  const handleRemoveClick = (publiId: any) => {
    setDataList((prevState) => {
      const newList = prevState.map((item) =>
        item.export === true && item.publi_id === publiId
          ? { ...item, export: false }
          : item
      );

      const removedItem = newList.find((item) => item.publi_id === publiId);
      if (removedItem) {
        toast(`Element retiré ! : ${removedItem.fullName}`, {
          style: {
            backgroundColor: "#d64d00",
            color: "#fff",
          },
        });
      }

      return newList;
    });
  };

  const handleClearClick = () => {
    setDataList((prevState) =>
      prevState.map((item) => ({ ...item, export: false }))
    );
    toast("Panier vidé !", {
      style: {
        backgroundColor: "#c3fad5",
      },
    });
  };

  const uniqueExportCount = dataList
    .filter((item) => item.export === true)
    .reduce((unique, item) => {
      if (
        !unique.some(
          (uniqueItem: { publi_id: any }) =>
            uniqueItem.publi_id === item.publi_id
        )
      ) {
        unique.push(item);
      }
      return unique;
    }, []).length;

  return (
    <div className="basket">
      <div className="basket-content">
        <div className="basket-controls">
          <Title look="h6" className="basket-title">
            Liste des publications à exporter
          </Title>
        </div>
        <div className="basket-controls">
          <Badge size="sm" color="blue-ecume" className="badge-count">
            {`${uniqueExportCount} publication${
              uniqueExportCount > 1 ? "s" : ""
            }`}
          </Badge>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsMinimized(!isMinimized)}
            className="btn-minimize"
          >
            {isMinimized ? "Maximiser" : "Minimiser"}
          </Button>
        </div>

        {!isMinimized && (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {Array.isArray(dataList) &&
              dataList
                .filter((item) => item.export === true)
                .reduce(
                  (unique, item) =>
                    unique.findIndex(
                      (obj: { publi_id: any }) => obj.publi_id === item.publi_id
                    ) > -1
                      ? unique
                      : [...unique, item],
                  []
                )
                .sort((a: { fullName: string }, b: { fullName: any }) =>
                  a.fullName.localeCompare(b.fullName)
                )
                .map(
                  (
                    item: { publi_id: any; fullName: any },
                    index: Key | null | undefined
                  ) => (
                    <li
                      key={index}
                      style={{
                        listStyleType: "none",
                        padding: 0,
                        borderBottom: "1px solid #000",
                      }}
                    >
                      <div className="basket-item">
                        <Text size="sm" bold>
                          {item.publi_id}
                        </Text>
                        <i>à lier à</i>
                        <Text size="sm" bold>
                          {item.fullName}
                          <button
                            onClick={() => handleRemoveClick(item.publi_id)}
                          >
                            <AiOutlineDelete color="red" />
                          </button>
                        </Text>
                      </div>
                    </li>
                  )
                )}
          </ul>
        )}

        <div className="fr-grid-row fr-grid-row--center fr-mt-3w">
          <ButtonGroup isInlineFrom="xs">
            <Button onClick={handleExportClick}>Exporter</Button>
            <Button
              color="green-emeraude"
              variant="primary"
              onClick={handleClearClick}
            >
              Vider le panier
            </Button>
          </ButtonGroup>
        </div>
        <div className="fr-grid-row fr-grid-row--center">
          <Button onClick={handleCopyToClipboardClick}>
            Copier et marquer comme traité
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExcelExportButton;
