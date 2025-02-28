import { toast } from "react-toastify";
import { Col, Row } from "@dataesr/dsfr-plus";
import ReactSelect from "react-select";
import { levenshteinDistance } from "../../utils/compare";
import { useDataList } from "./data-list-context";
import { ExtendedSelectWithNamesProps, SelectOption } from "../../types";

export default function SelectWithNames({
  contributionId,
  productionId,
  idRef,
  coloredName,
  authorData: propAuthorData,
  landingPage,
}: ExtendedSelectWithNamesProps) {
  const defaultAuthorData = {
    fullName: [],
    firstName: [],
    lastName: [],
  };

  const { fullName, firstName, lastName } = propAuthorData || defaultAuthorData;
  const { dataList, setDataList } = useDataList();

  const findClosestNameIndex = () => {
    const threshold = 7;
    let closestIndex = -1;
    let minDistance = Infinity;

    fullName.forEach((name, index) => {
      const distance = levenshteinDistance(name, coloredName);
      if (distance <= threshold && distance < minDistance) {
        closestIndex = index;
        minDistance = distance;
      }
    });

    return closestIndex;
  };

  const hasExistingElement = (export_status = false) => {
    return dataList.some(
      (e) =>
        e.person_id === idRef &&
        e.publi_id === productionId &&
        e.contribution_id === contributionId &&
        e.export === export_status
    );
  };

  const closestIndex = findClosestNameIndex();
  if (
    closestIndex !== -1 &&
    !hasExistingElement(false) &&
    !dataList.some(
      (e) => e.publi_id === productionId && e.contribution_id === contributionId
    )
  ) {
    const closestName = fullName[closestIndex];
    setDataList((prevState) => [
      ...prevState,
      {
        fullName: closestName,
        person_id: idRef,
        publi_id: productionId,
        contribution_id: contributionId,
        first_name: firstName[closestIndex],
        last_name: lastName[closestIndex],
        export: false,
      },
    ]);
  }

  const handleChange = (option: SelectOption | null) => {
    if (!option) return;

    const selectedIndex = fullName.indexOf(option.value);
    if (selectedIndex === -1) return;

    if (!hasExistingElement(true)) {
      setDataList((prevState) => {
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
      });
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
    }
  };

  const customStyles = {
    option: (provided: any, state: { data: SelectOption }) => ({
      ...provided,
      color: state.data.isColored ? "#1f8d49" : "black",
    }),
  };

  const threshold = 7;

  return (
    <Row>
      <Col>
        {landingPage && (
          <a
            href={landingPage}
            target="_blank"
            rel="noopener noreferrer"
            className="fr-mb-1w d-block"
          >
            Voir la publication
          </a>
        )}
        <ReactSelect<SelectOption>
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
          menuPosition={"fixed" as any}
        />
      </Col>
    </Row>
  );
}
