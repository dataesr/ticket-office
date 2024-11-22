import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import NameFromScanr from "../../api/contribution-api/getNames";
import { Col, Row } from "@dataesr/dsfr-plus";
import ReactSelect from "react-select";
import { levenshteinDistance } from "../../utils/compare";

import { useDataList } from "./data-list-context";
import { ContributionData, SelectOption, SelectWithNamesProps } from "./types";

export default function SelectWithNames({
  contributionId,
  productionId,
  idRef,
  coloredName,
}: SelectWithNamesProps) {
  const { fullName, firstName, lastName } = NameFromScanr(productionId);
  const { setDataList } = useDataList();

  const customStyles = {
    option: (provided: any, state: { data: SelectOption }) => ({
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

      const newElement: ContributionData = {
        fullName: closestName,
        person_id: idRef,
        publi_id: productionId,
        contribution_id: contributionId,
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
              e.contribution_id === newElement.contribution_id &&
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
    contributionId,
    setDataList,
  ]);

  const handleChange = (option: SelectOption) => {
    const selectedIndex = fullName.indexOf(option.value);

    setDataList((prevState) => {
      const existingItem = prevState.find(
        (e) =>
          e.person_id === idRef &&
          e.publi_id === productionId &&
          e.contribution_id === contributionId &&
          e.export === true
      );

      if (!existingItem) {
        const newList = [
          ...prevState,
          {
            fullName: option.value,
            person_id: idRef,
            publi_id: productionId,
            contribution_id: contributionId,
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
