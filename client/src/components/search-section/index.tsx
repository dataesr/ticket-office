import { useRef } from "react";
import { DismissibleTag, SearchBar, TagGroup } from "@dataesr/dsfr-plus";

type SearchSectionProps = {
  query: string[];
  handleSearch: (value: string) => void;
  handleRemoveQueryItem: (item: string) => void;
  isLarge?: boolean;
};

const SearchSection: React.FC<SearchSectionProps> = ({
  query,
  handleSearch,
  handleRemoveQueryItem,
  isLarge = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = (value = "") => {
    handleSearch(value);
    if (inputRef.current) inputRef.current.value = "";
  };

  const activeTags = query.filter((item) => item.trim() !== "");

  return (
    <>
      <SearchBar
        ref={inputRef}
        className="fr-mb-1w"
        isLarge={isLarge}
        label="Rechercher"
        buttonLabel="Rechercher"
        placeholder="Rechercher par nom, ID ou mot clé"
        onSearch={submit}
      />
      {activeTags.length > 0 && (
        <TagGroup className="fr-mb-1w">
          {activeTags.map((item) => (
            <DismissibleTag
              key={item}
              type="button"
              size="sm"
              aria-label={`Retirer le tag ${item}`}
              onClick={() => handleRemoveQueryItem(item)}
            >
              {item}
            </DismissibleTag>
          ))}
        </TagGroup>
      )}
    </>
  );
};

export default SearchSection;
