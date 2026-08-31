import { useId, useState } from "react";
import { DismissibleTag } from "../tag";

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
  const inputId = useId();
  const [value, setValue] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSearch(value);
    setValue("");
  };

  const activeTags = query.filter((item) => item.trim() !== "");

  return (
    <>
      <form
        role="search"
        className={`fr-search-bar fr-mb-1w${isLarge ? " fr-search-bar--lg" : ""}`}
        onSubmit={submit}
      >
        <label className="fr-label" htmlFor={inputId}>
          Rechercher
        </label>
        <input
          className="fr-input"
          type="search"
          id={inputId}
          placeholder="Rechercher par nom, ID ou mot clé"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit" className="fr-btn">
          Rechercher
        </button>
      </form>
      {activeTags.length > 0 && (
        <ul className="fr-tags-group fr-mb-1w">
          {activeTags.map((item) => (
            <li key={item}>
              <DismissibleTag onClick={() => handleRemoveQueryItem(item)}>
                {item}
              </DismissibleTag>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default SearchSection;
