import { Col, Toggle } from "@dataesr/dsfr-plus";
import Select from "react-select";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: 8,
    borderColor: state.isFocused ? "#2684FF" : "#CED4DA",
    boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(38, 132, 255, 0.25)" : null,
    border: state.isFocused ? "1px solid #2684FF" : "1px solid #CED4DA",
  }),
};

const Selectors = ({
  setSort,
  setStatus,
  searchInMessage,
  setSearchInMessage,
}) => {
  const options = [
    { value: "DESC", label: "Plus récentes" },
    { value: "ASC", label: "Plus anciennes" },
  ];

  const statusOptions = [
    { value: "choose", label: "Toutes les contributions" },
    { value: "new", label: "Nouvelles contributions" },
    { value: "ongoing", label: "Contribution en traitement" },
    { value: "treated", label: "Contributions traités" },
  ];

  return (
    <Col offsetLg="1">
      <Col className="fr-mb-1w">
        <Select
          options={options}
          defaultValue={options[0]}
          onChange={(selectedOption) => setSort(selectedOption.value)}
          styles={customStyles}
        />
      </Col>
      <Select
        options={statusOptions}
        defaultValue={statusOptions[0]}
        onChange={(selectedOption) => setStatus(selectedOption.value)}
        styles={customStyles}
      />
      <Toggle
        checked={searchInMessage}
        id="searchInMessage"
        name={"Rechercher dans les messages"}
        onChange={(e) => setSearchInMessage(e.target.checked)}
        label="Rechercher dans les messages"
      />
    </Col>
  );
};

export default Selectors;
