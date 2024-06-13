import { Badge, Button, ButtonGroup, Text, Title } from "@dataesr/dsfr-plus";
import * as XLSX from "xlsx";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { useDataList } from "./data-list-context";

const ExcelExportButton = () => {
  const { dataList, setDataList } = useDataList();
  const handleExportClick = () => {
    const dataToExport = dataList.map((item) => ({
      person_id: item.person_id || "",
      publi_id: item.publi_id || "",
      full_name: item.fullName || "",
      first_name: item.first_name || "",
      last_name: item.last_name || "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "export.xlsx");
  };

  const handleRemoveClick = (index: number) => {
    setDataList((prevState) => {
      const newList = prevState.map((item) => {
        if (
          item.export === true &&
          item.publi_id === dataList[index].publi_id
        ) {
          return { ...item, export: false };
        } else {
          return item;
        }
      });

      toast(`Element retiré ! : ${newList[index].fullName}`, {
        style: {
          backgroundColor: "#d64d00",
          color: "#fff",
        },
      });
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
        <Title look="h6" className="basket-title">
          Liste des publications à exporter
        </Title>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <div className="fr-grid-row fr-grid-row--center">
            <Badge
              size="sm"
              color="blue-ecume"
              className="fr-mr-1w fr-mb-1w status"
            >
              {`${
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
                  ).length
              } publication${
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
                  ).length > 1
                  ? "s"
                  : ""
              }`}
            </Badge>
          </div>

          {Array.isArray(dataList) &&
            dataList
              .filter((item) => item.export === true)
              .reduce(
                (unique, item) =>
                  unique.findIndex((obj) => obj.publi_id === item.publi_id) > -1
                    ? unique
                    : [...unique, item],
                []
              )
              .map((item, index) => (
                <li
                  key={index}
                  style={{
                    listStyleType: "none",
                    padding: 0,
                    borderBottom: "1px solid #000",
                  }}
                >
                  <br />
                  <div className="basket-item">
                    <Text size="sm" bold>
                      {item.publi_id}
                    </Text>
                    <i>à lier à</i>
                    <Text size="sm" bold>
                      {item.fullName}
                      <button onClick={() => handleRemoveClick(index)}>
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
      </div>
    </div>
  );
};

export default ExcelExportButton;
