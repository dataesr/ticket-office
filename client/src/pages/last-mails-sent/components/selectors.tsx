const Selectors = ({ uniqueProfiles, setStatus }) => {
  const handleProfileChange = (event) => {
    setStatus(event.target.value);
  };

  return (
    <>
      <select onChange={handleProfileChange} className="fr-select ">
        <option value="all">Tout le monde</option>
        {uniqueProfiles.map((profile, index) => (
          <option key={index} value={profile}>
            {profile}
          </option>
        ))}
      </select>
    </>
  );
};

export default Selectors;
