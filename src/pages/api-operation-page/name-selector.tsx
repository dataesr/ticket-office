import ReactSelect from "react-select";
import NameFromScanr from "../../api/contribution-api/getNames";
import { levenshteinDistance } from "./utils/compare";

export default function SelectWithNames({
  productionId,
  setDataList,
  idRef,
  coloredName,
}) {
  const { fullName, firstName, lastName } = NameFromScanr(productionId);
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.data.isColored ? "#1f8d49" : "black",
    }),
  };

  const threshold = 10;

  const handleChange = (selectedOption) => {
    const selectedIndex = fullName.indexOf(selectedOption.value);
    setDataList((prevState) => [
      ...prevState,
      {
        fullName: selectedOption.value,
        person_id: idRef,
        publi_id: productionId,
        first_name: firstName[selectedIndex],
        last_name: lastName[selectedIndex],
      },
    ]);
  };

  const options = fullName.map((name, index) => ({
    value: name,
    label: name,
    firstName: firstName[index],
    isColored: levenshteinDistance(name, coloredName) <= threshold,
  }));

  return (
    <ReactSelect
      options={options}
      onChange={handleChange}
      styles={customStyles}
      placeholder="Trouver le nom"
    />
  );
}
