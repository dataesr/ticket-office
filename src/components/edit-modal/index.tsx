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
import { Contribute_Production, Contribution, Inputs } from "../../types";
import { postHeaders } from "../../config/api";
import Select from "react-select";

type EditModalProps = {
  isOpen: boolean;
  data: Contribution | Contribute_Production;
  onClose: () => void;
  refetch;
};

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  data,
  onClose,
  refetch,
}) => {
  const user = sessionStorage.getItem("selectedProfile");
  let basePath = "contact";

  if (window.location.pathname.includes("contributionpage")) {
    basePath = "contribute";
  } else if (window.location.pathname.includes("apioperations")) {
    basePath = "contribute_productions";
  }
  const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
  const url = isDevelopment
    ? `https://scanr-api.dataesr.ovh/${basePath}/${data._id}`
    : `${window.location.origin}/api/${basePath}/${data._id}`;
  const [inputs, setInputs] = useState<Inputs>({
    team: [user],
    status: "treated",
    tag: [],
    idRef: "",
    comment: "",
  });
  useEffect(() => {
    setInputs({
      team: [user],
      status: "treated",
      tag: [],
      idRef: "",
      comment: "",
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
    setInputs((prevInputs) => ({
      ...prevInputs,
      tag: [...prevInputs.tag, newTag],
    }));
  };
  const handleCommentChange = (event) => {
    const newComment = event.target.value;
    setInputs((prevInputs) => ({ ...prevInputs, comment: newComment }));
  };

  const handleIdRefChange = (event) => {
    const newIdref = event.target.value;
    setInputs((prevInputs) => ({ ...prevInputs, idRef: newIdref }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: postHeaders,
        body: JSON.stringify({
          status: inputs.status,
          tag: inputs.tag,
          idref: inputs.idRef,
          comment: inputs.comment,
        }),
      });
      if (!response.ok) {
        console.log("Erreur de réponse", response);
      } else {
        const responseData = await response.json();
        console.log("Données de réponse", responseData);
        refetch();
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
        <Row gutters>
          <Col>
            <TextArea
              label={
                data.comment
                  ? "Mettre à jour le commentaire pour l'équipe"
                  : "Ajouter un commentaire pour l'équipe"
              }
              hint="Ce commentaire ne sera lu que par les membres de l'équipe"
              value={inputs.comment}
              onChange={handleCommentChange}
            />
          </Col>
        </Row>
        <Col className="fr-mt-5w">
          <Button onClick={handleSubmit} variant="secondary" size="sm">
            <Title as="h4">Enregistrer</Title>
          </Button>
        </Col>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
