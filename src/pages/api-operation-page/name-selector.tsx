import NameFromScanr from "../../api/contribution-api/getNames";

export default function SelectWithNames({ productionId, setDataList, idRef }) {
  const { fullName, firstName, lastName } = NameFromScanr(productionId);
  const handleChange = (event) => {
    const selectedName = event.target.value;
    const selectedIndex = fullName.indexOf(selectedName);

    setDataList((prevState) => [
      ...prevState,
      {
        fullName: selectedName,
        person_id: idRef,
        publi_id: productionId,
        first_name: firstName[selectedIndex],
        last_name: lastName[selectedIndex],
      },
    ]);
  };

  return (
    <select onChange={handleChange}>
      <option value="">Select a name</option>
      {fullName.map((name, index) => (
        <option key={index} value={name}>
          {name}
        </option>
      ))}
    </select>
  );
}
