import { DismissibleTag, SearchBar } from "@dataesr/dsfr-plus";
import { SearchSectionProps } from "../types";

const SearchSection: React.FC<SearchSectionProps> = ({
  query,
  handleSearch,
  handleRemoveQueryItem,
  isLarge=true
}) => (
  <>
    <SearchBar
      className="fr-mb-1w"
      onSearch={(value) => handleSearch(value || "")}
      isLarge={isLarge}
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
