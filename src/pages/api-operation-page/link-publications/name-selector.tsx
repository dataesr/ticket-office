import ReactSelect from "react-select";
import "react-toastify/dist/ReactToastify.css";
import NameFromScanr from "../../../api/contribution-api/getNames";
import { levenshteinDistance } from "../utils/compare";
import { Col, Row } from "@dataesr/dsfr-plus";
import { useDataList } from "./data-list-context";
import { useEffect } from "react";

export default function SelectWithNames({ productionId, idRef, coloredName }) {
  const { fullName, firstName, lastName } = NameFromScanr(productionId);
  const { dataList, setDataList } = useDataList();
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.data.isColored ? "#1f8d49" : "black",
    }),
  };
  const threshold = 7;
  console.log(dataList);
  const options = fullName.map((name, index) => ({
    value: name,
    label: name,
    firstName: firstName[index],
    lastName: lastName[index],
    isColored: levenshteinDistance(name, coloredName) <= threshold,
  }));
  useEffect(() => {
    const selectedIndex = fullName.indexOf(coloredName);
    if (selectedIndex !== -1 && options[selectedIndex]) {
      const selectedOption = options[selectedIndex];
      const newElement = {
        fullName: coloredName,
        person_id: idRef,
        publi_id: productionId,
        first_name: selectedOption.firstName,
        last_name: selectedOption.lastName,
        export: false,
      };

      setDataList((prevState) => {
        if (
          !prevState.some(
            (e) =>
              e.person_id === newElement.person_id &&
              e.publi_id === newElement.publi_id
          )
        ) {
          return [...prevState, newElement];
        } else {
          return prevState;
        }
      });
    }
  }, []);

  const handleChange = (option: { value: any }) => {
    const selectedIndex = fullName.indexOf(option.value);

    setDataList((prevState) => {
      // const index = prevState.findIndex(
      //   (item) => item.fullName === option.value
      // );
      // console.log(index);
      // if (index !== -1) {
      //   const newState = [...prevState];
      //   newState[index] = {
      //     ...newState[index],
      //     export: true,
      //   };

      //   return newState;
      // }
      return [
        ...prevState,
        {
          fullName: option.value,
          person_id: idRef,
          publi_id: productionId,
          first_name: firstName[selectedIndex],
          last_name: lastName[selectedIndex],
          export: true,
        },
      ];
    });
  };

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
