import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalTitle,
  ModalContent,
  Col,
  TextArea,
  Title,
  Button,
  Row,
} from "@dataesr/dsfr-plus";
import { Contribution } from "../../types";
import { postHeaders } from "../../config/api";
import Select from "react-select";

type EditModalProps = {
  isOpen: boolean;
  data: Contribution;
  onClose: () => void;
};

const EditModal: React.FC<EditModalProps> = ({ isOpen, data, onClose }) => {
  const user = sessionStorage.getItem("selectedProfile");
  const [inputs, setInputs] = useState({
    team: [user],
    status: data.status,
    tag: "",
    idRef: "",
  });

  useEffect(() => {
    setInputs({
      team: [user],
      status: "treated",
      tag: "",
      idRef: "",
    });
  }, [data, user]);

  const handleStatusChange = (selectedOption) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      status: selectedOption.value,
    }));
  };

  const handleTagChange = (event) => {
    const newTag = event.target.value;
    setInputs((prevInputs) => ({ ...prevInputs, tag: newTag }));
  };

  const handleIdRefChange = (event) => {
    const newIdref = event.target.value;
    setInputs((prevInputs) => ({ ...prevInputs, idRef: newIdref }));
  };

  const basePath = window.location.pathname.includes("contact")
    ? "contact"
    : "contribute";

  const handleSubmit = async () => {
    try {
      const response = await fetch(`api/${basePath}/${data._id}`, {
        method: "PATCH",
        headers: postHeaders,
        body: JSON.stringify({
          status: inputs.status,
          tag: inputs.tag,
          idref: inputs.idRef,
        }),
      });
      if (!response.ok) {
        console.log("Erreur de réponse", response);
      } else {
        const responseData = await response.json();
        console.log("Données de réponse", responseData);
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const statusOptions = [
    { value: "new", label: "Nouveau" },
    { value: "ongoing", label: "En traitement" },
    { value: "treated", label: "Traité" },
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: 8,
      borderColor: state.isFocused ? "#2684FF" : "#CED4DA",
      boxShadow: state.isFocused
        ? "0 0 0 0.2rem rgba(38, 132, 255, 0.25)"
        : null,
    }),
  };

  return (
    <Modal isOpen={isOpen} hide={onClose}>
      <ModalTitle>Modifier la contribution </ModalTitle>
      <ModalContent className="profile-modal-content">
        <Col className="fr-mb-1w">
          <Select
            id="statusInput"
            name="status"
            options={statusOptions}
            value={statusOptions.find(
              (option) => option.value === inputs.status
            )}
            onChange={handleStatusChange}
            styles={customStyles}
          />
        </Col>
        <Row gutters>
          <Col>
            <TextArea
              label="Ajouter un tag"
              maxLength={6}
              hint="Décrivez en un mot la contribution"
              value={inputs.tag}
              onChange={handleTagChange}
            />
          </Col>
          <Col>
            <TextArea
              label="Ajouter un idref"
              value={inputs.idRef}
              onChange={handleIdRefChange}
              hint="Ajoutez un identifiant"
            />
          </Col>
        </Row>

        <Col className="fr-mt-5w">
          <Button onClick={handleSubmit} variant="secondary" size="sm">
            <Title as="h3">Enregistrer</Title>
          </Button>
        </Col>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
