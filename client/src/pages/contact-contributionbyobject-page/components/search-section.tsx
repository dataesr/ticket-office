import { DismissibleTag, SearchBar } from "@dataesr/dsfr-plus";

const SearchSection: React.FC<{
  query: string[];
  handleSearch: (value: string) => void;
  handleRemoveQueryItem: (item: string) => void;
}> = ({ query, handleSearch, handleRemoveQueryItem }) => (
  <>
    <SearchBar
      className="fr-mb-1w"
      onSearch={(value) => handleSearch(value || "")}
      isLarge
      buttonLabel="Rechercher"
      placeholder="Rechercher par nom, ID ou mot clé"
    />
    <div className="fr-mb-1w">
      {query
        ?.filter((item) => item.trim() !== "")
        ?.map((item, index) => (
          <DismissibleTag
            key={index}
            color="purple-glycine"
            className="fr-mr-1w"
            onClick={() => handleRemoveQueryItem(item)}
          >
            {item}
          </DismissibleTag>
        ))}
    </div>
  </>
);

export default SearchSection;
