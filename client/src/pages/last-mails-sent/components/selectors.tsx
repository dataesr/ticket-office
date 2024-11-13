import { Col } from "@dataesr/dsfr-plus";
const Selectors = ({ uniqueProfiles, setStatus }) => {
  const handleProfileChange = (event) => {
    setStatus(event.target.value);
  };

  return (
    <Col>
      <Col className="fr-mb-1w">
        <select onChange={handleProfileChange} className="fr-select">
          <option value="all">Tout le monde</option>
          {uniqueProfiles.map((profile, index) => (
            <option key={index} value={profile}>
              {profile}
            </option>
          ))}
        </select>
      </Col>
    </Col>
  );
};

export default Selectors;
