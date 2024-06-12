import ReactSelect from "react-select";
import "react-toastify/dist/ReactToastify.css";
import NameFromScanr from "../../../api/contribution-api/getNames";
import { levenshteinDistance } from "../utils/compare";
import { Col, Row } from "@dataesr/dsfr-plus";
import { useEffect, useState } from "react";

export default function SelectWithNames({
  productionId,
  setDataList,
  idRef,
  coloredName,
  setSelectedId,
  setIsSelected,
}) {
  const { fullName, firstName, lastName } = NameFromScanr(productionId);
  const [selectedOption, setSelectedOption] = useState(null);
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.data.isColored ? "#1f8d49" : "black",
    }),
  };

  const threshold = 7;

  const handleChange = (option) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    const optionToValidate =
      selectedOption || options.find((option) => option.label === coloredName);

    if (optionToValidate) {
      const selectedIndex = fullName.indexOf(optionToValidate.value);
      setDataList((prevState) => [
        ...prevState,
        {
          fullName: optionToValidate.value,
          person_id: idRef,
          publi_id: productionId,
          first_name: firstName[selectedIndex],
          last_name: lastName[selectedIndex],
        },
      ]);
      setSelectedId((prevIds) => [...prevIds, productionId]);
      setIsSelected(true);
    }
  }, [selectedOption]);

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
