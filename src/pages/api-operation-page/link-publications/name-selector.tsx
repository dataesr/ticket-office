import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import NameFromScanr from "../../../api/contribution-api/getNames";
import { levenshteinDistance } from "../utils/compare";
import { Col, Row } from "@dataesr/dsfr-plus";
import { useDataList } from "./data-list-context";
import ReactSelect from "react-select";

export default function SelectWithNames({ productionId, idRef, coloredName }) {
  const { fullName, firstName, lastName } = NameFromScanr(productionId);
  const { setDataList } = useDataList();
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.data.isColored ? "#1f8d49" : "black",
    }),
  };
  const threshold = 7;

  useEffect(() => {
    let closestIndex = -1;
    let minDistance = Infinity;

    fullName.forEach((name, index) => {
      const distance = levenshteinDistance(name, coloredName);
      if (distance <= threshold && distance < minDistance) {
        closestIndex = index;
        minDistance = distance;
      }
    });

    if (closestIndex !== -1) {
      const closestName = fullName[closestIndex];
      const selectedOption = {
        value: closestName,
        firstName: firstName[closestIndex],
        lastName: lastName[closestIndex],
      };

      const newElement = {
        fullName: closestName,
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
              e.publi_id === newElement.publi_id &&
              e.export === false
          )
        ) {
          return [...prevState, newElement];
        } else {
          return prevState;
        }
      });
    }
  }, [
    coloredName,
    fullName,
    firstName,
    lastName,
    idRef,
    productionId,
    setDataList,
  ]);

  const handleChange = (option) => {
    const selectedIndex = fullName.indexOf(option.value);

    setDataList((prevState) => {
      const existingItem = prevState.find(
        (e) =>
          e.person_id === idRef &&
          e.publi_id === productionId &&
          e.export === true
      );

      if (!existingItem) {
        const newList = [
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

        toast(`La publication de ${option.value} a été ajoutée au panier`, {
          style: {
            backgroundColor: "#4caf50",
            color: "#fff",
          },
        });

        return newList;
      } else {
        toast.warn(
          `La publication de ${option.value} est déjà dans le panier !`,
          {
            style: {
              backgroundColor: "#f57c00",
              color: "#fff",
            },
          }
        );

        return prevState;
      }
    });
  };

  return (
    <Row>
      <Col>
        <ReactSelect
          options={fullName.map((name, index) => ({
            value: name,
            label: name,
            firstName: firstName[index],
            lastName: lastName[index],
            isColored: levenshteinDistance(name, coloredName) <= threshold,
          }))}
          onChange={handleChange}
          styles={customStyles}
          placeholder={coloredName}
          menuPortalTarget={document.body}
          menuPosition="fixed"
        />
      </Col>
    </Row>
  );
}
