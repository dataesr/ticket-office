import { useState } from "react";
import Modal from "../modal";
import { SelectableTag } from "../tag";
import { TagSelectionModalProps } from "../../types";

const TagSelectionModal: React.FC<TagSelectionModalProps> = ({
  isOpen,
  allTags,
  onClose,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleCancel = () => {
    setSelectedTags([]);
    onClose([]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Sélectionner des tags"
    >
      <ul className="fr-tags-group fr-mb-4w">
        {allTags.map((tag) => (
          <li key={tag}>
            <SelectableTag
              selected={selectedTags.includes(tag)}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </SelectableTag>
          </li>
        ))}
      </ul>
      <ul className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse">
        <li>
          <button
            type="button"
            className="fr-btn"
            onClick={() => onClose(selectedTags)}
          >
            Valider
          </button>
        </li>
        <li>
          <button
            type="button"
            className="fr-btn fr-btn--secondary"
            onClick={handleCancel}
          >
            Annuler
          </button>
        </li>
      </ul>
    </Modal>
  );
};

export default TagSelectionModal;
