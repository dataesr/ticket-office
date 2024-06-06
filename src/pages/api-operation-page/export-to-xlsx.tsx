import { Button, Col, Row, Text, Title } from "@dataesr/dsfr-plus";
import * as XLSX from "xlsx";
import { AiOutlineDelete } from "react-icons/ai";

const ExcelExportButton = ({ dataList, setDataList }) => {
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
    setDataList((prevDataList) => prevDataList.filter((_, i) => i !== index));
  };

  return (
    <div className="basket">
      <Title look="h6" className="basket-title">
        Liste des publications à exporter
      </Title>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {Array.isArray(dataList) &&
          dataList.map((item, index) => (
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
      <Button onClick={handleExportClick}>Exporter</Button>
    </div>
  );
};

export default ExcelExportButton;
