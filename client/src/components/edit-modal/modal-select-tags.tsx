import React, { useState } from "react";
import {
  Modal,
  ModalTitle,
  ModalContent,
  Row,
  Button,
  SelectableTag,
} from "@dataesr/dsfr-plus";
import { TagSelectionModalProps } from "../../types";

const TagSelectionModal: React.FC<TagSelectionModalProps> = ({
  isOpen,
  allTags,
  onClose,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleConfirm = () => {
    onClose(selectedTags);
  };

  const handleCancel = () => {
    setSelectedTags([]);
    onClose([]);
  };

  return (
    <Modal isOpen={isOpen} hide={() => handleCancel()}>
      <ModalTitle>Sélectionner des tags</ModalTitle>
      <ModalContent>
        <Row gutters>
          {allTags.map((tag, index) => (
            <div key={index}>
              <SelectableTag
                selected={selectedTags.includes(tag)}
                color="blue-ecume"
                className="fr-mr-1w fr-mb-1w"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </SelectableTag>
            </div>
          ))}
        </Row>
        <Row className="fr-btn-group fr-btn-group--right fr-mt-4w">
          <Button variant="secondary" onClick={handleCancel}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Valider
          </Button>
        </Row>
      </ModalContent>
    </Modal>
  );
};

export default TagSelectionModal;
