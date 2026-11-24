import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Modal,
  ModalContent,
  ModalTitle,
  SelectableTag,
  TagGroup,
} from "@dataesr/dsfr-plus";
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
    <Modal isOpen={isOpen} hide={handleCancel}>
      <ModalTitle>Sélectionner des tags</ModalTitle>
      <ModalContent>
        <TagGroup className="fr-mb-4w">
          {allTags.map((tag) => (
            <SelectableTag
              key={tag}
              type="button"
              size="sm"
              selected={selectedTags.includes(tag)}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </SelectableTag>
          ))}
        </TagGroup>
        <ButtonGroup align="right" isReversed>
          <Button type="button" onClick={() => onClose(selectedTags)}>
            Valider
          </Button>
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Annuler
          </Button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  );
};

export default TagSelectionModal;
