import { Badge, Button, ButtonGroup, Text, Title } from "@dataesr/dsfr-plus";
import * as XLSX from "xlsx";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { useDataList } from "./data-list-context";
import { useState } from "react";
import "./styles.scss";

const ExcelExportButton = () => {
  const { dataList, setDataList } = useDataList();
  const [isMinimized, setIsMinimized] = useState(false);

  const handleExportClick = () => {
    const dataToExport = dataList
      .filter((item) => item.export === true)
      .map((item) => ({
        person_id: item.person_id || "",
        publi_id: item.publi_id || "",
        full_name: item.fullName || "",
        first_name: item.first_name || "",
        last_name: item.last_name || "",
      }));
    if (dataToExport.length === 0) {
      toast.error("Aucune publication à exporter !");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "export.xlsx");
  };

  const handleRemoveClick = (publiId) => {
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
            {`${
              dataList.filter((item) => item.export === true).length
            } publication${
              dataList.filter((item) => item.export === true).length > 1
                ? "s"
                : ""
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
          <>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {Array.isArray(dataList) &&
                dataList
                  .filter((item) => item.export === true)
                  .reduce(
                    (unique, item) =>
                      unique.findIndex(
                        (obj) => obj.publi_id === item.publi_id
                      ) > -1
                        ? unique
                        : [...unique, item],
                    []
                  )
                  .sort((a, b) => a.fullName.localeCompare(b.fullName)) // Tri par fullName
                  .map((item, index) => (
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
                  ))}
            </ul>
            <div className="fr-grid-row fr-grid-row--center">
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
          </>
        )}
      </div>
    </div>
  );
};

export default ExcelExportButton;
