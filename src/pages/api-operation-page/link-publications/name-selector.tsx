import ReactSelect from "react-select";
import "react-toastify/dist/ReactToastify.css";
import NameFromScanr from "../../../api/contribution-api/getNames";
import { levenshteinDistance } from "../utils/compare";
import { Col, Row } from "@dataesr/dsfr-plus";
import { useDataList } from "./data-list-context";

export default function SelectWithNames({
  productionId,
  idRef,
  coloredName,
  setSelectedId,
}) {
  const { fullName, firstName, lastName } = NameFromScanr(productionId);
  const { dataList, setDataList } = useDataList();
  console.log(dataList);
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.data.isColored ? "#1f8d49" : "black",
    }),
  };
  const threshold = 7;

  const handleChange = (option: { value: any }) => {
    const selectedIndex = fullName.indexOf(option.value);

    setDataList((prevState) => [
      ...prevState,
      {
        fullName: option.value,
        person_id: idRef,
        publi_id: productionId,
        first_name: firstName[selectedIndex],
        last_name: lastName[selectedIndex],
      },
    ]);

    setSelectedId((prevIds) => [...prevIds, productionId]);
  };

  const options = fullName.map((name, index) => ({
    value: name,
    label: name,
    firstName: firstName[index],
    isColored: levenshteinDistance(name, coloredName) <= threshold,
  }));

  return (
    <Row>
      <Col className="fr-mr-2w">
        <ReactSelect
          options={options}
          onChange={handleChange}
          styles={customStyles}
          placeholder={coloredName}
        />
      </Col>
    </Row>
  );
}
