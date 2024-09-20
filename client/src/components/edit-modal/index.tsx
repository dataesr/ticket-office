import { useEffect, useState } from "react";
import {
  Modal,
  ModalTitle,
  ModalContent,
  Col,
  TextArea,
  Button,
  Row,
  DismissibleTag,
  Text,
} from "@dataesr/dsfr-plus";
import { EditModalProps, Inputs } from "../../types";
import { postHeaders } from "../../config/api";
import { toast } from "react-toastify";
import ProfileModal from "../profil-modal";
import TagSelectionModal from "./modal-select-tags";

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  data,
  onClose,
  refetch,
  allTags,
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 8758832 (fix(edit-contrib): fix bug)
  const [selectedProfile] = useState(localStorage.getItem("selectedProfile"));
  const [inputs, setInputs] = useState<Inputs>({
    team: [selectedProfile],
    status: "treated",
    tags: [],
<<<<<<< HEAD
    comment: "",
    extra: "",
  });
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showTagModal] = useState(false);

  let basePath = "contacts";

  if (window.location.pathname.includes("contributionpage")) {
    basePath = "contribute";
  }
  if (window.location.pathname.includes("scanr-removeuser")) {
    basePath = "remove-user";
  }
  if (window.location.pathname.includes("scanr-namechange")) {
    basePath = "update-user-data";
=======
  const [selectedProfile, setSelectedProfile] = useState(
    localStorage.getItem("selectedProfile")
  );
  const [existingTags, setExistingTags] = useState<string[]>([]);
=======
    idref: "",
    comment: "",
  });
>>>>>>> 8758832 (fix(edit-contrib): fix bug)
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showTagModal] = useState(false);

  let basePath = "contact";

  if (window.location.pathname.includes("contributionpage")) {
    basePath = "contribute";
<<<<<<< HEAD
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
  }
  if (window.location.pathname.includes("scanr-removeuser")) {
    basePath = "remove-user";
  }
  if (window.location.pathname.includes("scanr-namechange")) {
    basePath = "update-user-data";
>>>>>>> 8372f23 (fix(edit): update package delete dep)
  } else if (window.location.pathname.includes("apioperations")) {
    basePath = "production";
  }

  const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
  const url = isDevelopment
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    ? `http://localhost:3000/api/${basePath}/${data?.id}`
    : `https://ticket-office.staging.dataesr.ovh/api/${basePath}/${data?.id}`;
=======
    ? `http://localhost:3000/api/${basePath}/${data?._id}`
=======
    ? `http://localhost:3000/api/${basePath}/:${data?._id}`
>>>>>>> 73efe6f (fix(api): fix url)
    : `https://ticket-office.staging.dataesr.ovh/api/${basePath}/${data?._id}`;
  const [inputs, setInputs] = useState<Inputs>({
    team: [selectedProfile],
    status: "treated",
    tags: [],
    idRef: "",
    comment: "",
  });
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
    ? `http://localhost:3000/api/${basePath}/${data?._id}`
    : `https://ticket-office.staging.dataesr.ovh/api/${basePath}/${data?._id}`;
>>>>>>> 8758832 (fix(edit-contrib): fix bug)

  useEffect(() => {
    if (!selectedProfile) {
      setShowProfileModal(true);
    }
<<<<<<< HEAD
<<<<<<< HEAD
=======
    if (data && data.status) {
      setCurrentStatus(data.status);
    }
    setInputs({
      team: [selectedProfile],
      status: data ? data.status : "treated",
      tags: [],
      idRef: "",
      comment: "",
    });

    const fetchExistingTags = async () => {
      if (!data?._id) return;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: postHeaders,
        });
        if (response.ok) {
          const currentData = await response.json();
          console.log("Données reçues:", currentData);
          setExistingTags(currentData.tags || []);
        } else if (response.status === 404) {
          console.warn("Aucun tag existant trouvé");
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des tags existants",
          error
        );
      }
    };

    fetchExistingTags();
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
>>>>>>> 8758832 (fix(edit-contrib): fix bug)

    const formattedTags = Array.isArray(allTags)
      ? Array.from(
          new Set(
            allTags
              .flat()
              .filter((tag) => typeof tag === "string" && tag.trim() !== "")
              .map((tag) => tag.toUpperCase())
          )
        ).sort()
      : [];
    setFilteredTags(formattedTags);
<<<<<<< HEAD
<<<<<<< HEAD

    if (data) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        comment: data.comment || "",
        extra:
          "extra" in data && data.extra
            ? Object.entries(data.extra)
                .map(([key, value]) => `${key}: ${value}`)
                .join("\n")
            : "",
        tags: "tags" in data ? data.tags : [],
      }));
    }
  }, [allTags, selectedProfile, data]);

  const handleInputChange = (key: keyof Inputs, value: any) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [key]: value,
=======
  }, [data, selectedProfile, allTags]);
=======
  }, [allTags, selectedProfile]);
>>>>>>> 8758832 (fix(edit-contrib): fix bug)

  const handleInputChange = (key: keyof Inputs, value: any) => {
    setInputs((prevInputs) => ({ ...prevInputs, [key]: value }));
  };

  const handleTagInputChange = () => {
    const tagsArray = tagInput
      .split(",")
      .map((tag) => tag.trim().toUpperCase())
      .filter((tag) => tag !== "");

    if (tagsArray.length > 0) {
      handleInputChange("tags", [...inputs.tags, ...tagsArray]);
      setTagInput("");
    }
  };

<<<<<<< HEAD
  const handleCommentChange = (event) => {
    const newComment = event.target.value;
    setInputs((prevInputs) => ({ ...prevInputs, comment: newComment }));
  };

  const handleIdRefChange = (event) => {
    const newIdref = event.target.value;
    setInputs((prevInputs) => ({ ...prevInputs, idRef: newIdref }));
  };

  const handleTagDelete = async (tag) => {
    try {
      const updatedTags = existingTags.filter(
        (existingTag) => existingTag !== tag
      );
      const body = { tags: updatedTags };

      const response = await fetch(url, {
        method: "PATCH",
        headers: postHeaders,
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setExistingTags(updatedTags);
        toast.success(
          "Tag supprimé avec succès! Cliquez sur enregistrer pour valider"
        );
      } else {
        console.error("Erreur lors de la suppression du tag", response);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du tag", error);
    }
  };

  const handleTagRemove = (tagToRemove) => {
    const updatedTags = inputs.tags.filter((tag) => tag !== tagToRemove);
    setInputs((prevInputs) => ({
      ...prevInputs,
      tags: updatedTags,
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
    }));
=======
  const handleTagRemove = (tagToRemove: string) => {
    handleInputChange(
      "tags",
      inputs.tags.filter((tag) => tag !== tagToRemove)
    );
>>>>>>> 8758832 (fix(edit-contrib): fix bug)
  };

  const handleSubmit = async () => {
    if (
      !selectedProfile ||
      selectedProfile === "null" ||
      selectedProfile === ""
    ) {
      setShowProfileModal(true);
      return;
    }

    try {
<<<<<<< HEAD
<<<<<<< HEAD
      const extraEntries = inputs.extra.split("\n").reduce((acc, line) => {
        const [key, value] = line.split(":").map((part) => part.trim());
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);

      const body = JSON.stringify({
        ...inputs,
        team: [selectedProfile],
        extra: extraEntries,
      });

      const response = await fetch(url, {
        method: "PATCH",
        headers: postHeaders,
        body,
      });

      if (response.ok) {
        refetch();
        onClose();
        toast.success("Les modifications ont été enregistrées avec succès !");
      } else {
        throw new Error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement");
    }
  };

  const handleTagInputChange = () => {
    const tagsArray = tagInput
      .split(",")
      .map((tag) => tag.trim().toUpperCase())
      .filter((tag) => tag !== "");
    if (tagsArray.length > 0) {
      handleInputChange("tags", [...inputs.tags, ...tagsArray]);
      setTagInput("");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    handleInputChange(
      "tags",
      inputs.tags.filter((tag) => tag !== tagToRemove)
    );
=======
      const currentDataResponse = await fetch(url, {
        method: "GET",
        headers: postHeaders,
      });
      console.log(url);
      if (!currentDataResponse.ok) {
        console.log(
          "Erreur de réponse lors de la récupération des données actuelles",
          currentDataResponse
        );
        return;
      }

      const currentData = await currentDataResponse.json();

      const updatedTags = currentData.tags
        ? [...currentData.tags, ...inputs.tags]
        : inputs.tags;

      const body = {
        status: inputs.status,
        tags: updatedTags,
        team: inputs.team,
        idref: inputs.idRef,
        comment: inputs.comment,
      };
=======
      const body = JSON.stringify({ ...inputs, team: [selectedProfile] });
>>>>>>> 8758832 (fix(edit-contrib): fix bug)

      const response = await fetch(url, {
        method: "PUT",
        headers: postHeaders,
        body,
      });

      if (response.ok) {
        refetch();
        onClose();
        toast.success("Les modifications ont été enregistrées avec succès !");
      } else {
        throw new Error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement");
    }
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
  };

  return (
    <>
      <Modal isOpen={isOpen} hide={onClose}>
        <ModalTitle>Modifier la contribution</ModalTitle>
<<<<<<< HEAD
<<<<<<< HEAD
        <ModalContent>
=======
        <ModalContent className="profile-modal-content">
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
        <ModalContent>
>>>>>>> 8758832 (fix(edit-contrib): fix bug)
          <Col className="fr-mb-1w">
            <label htmlFor="statusInput">Statut</label>
            <select
              id="statusInput"
              name="status"
              value={inputs.status}
<<<<<<< HEAD
<<<<<<< HEAD
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="fr-select"
            >
              <option value="treated">Traité</option>
              <option value="new">Nouveau</option>
              <option value="ongoing">En traitement</option>
=======
              onChange={handleStatusChange}
              className="fr-select"
            >
              <option value="" disabled hidden>
                {currentStatus}
              </option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="fr-select"
            >
              <option value="treated">Traité</option>
              <option value="new">Nouveau</option>
              <option value="ongoing">En traitement</option>
>>>>>>> 8758832 (fix(edit-contrib): fix bug)
            </select>
          </Col>
          <Row gutters>
            <Col md="6">
              <TextArea
                label="Ajouter des tags"
                hint="Séparez les tags par des virgules"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
              {tagInput && (
                <Button
                  onClick={handleTagInputChange}
                  variant="secondary"
                  size="sm"
                >
                  Valider
                </Button>
              )}
            </Col>
            <Col md="6">
<<<<<<< HEAD
<<<<<<< HEAD
=======
              <Button onClick={handleTagAdd} variant="secondary" size="sm">
                Sélectionner des tags
              </Button>
              <br />
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
>>>>>>> 8758832 (fix(edit-contrib): fix bug)
              {inputs.tags.map((tag, index) => (
                <span key={index}>
                  <DismissibleTag
                    size="sm"
                    className="fr-mt-1w"
                    onClick={() => handleTagRemove(tag)}
                  >
<<<<<<< HEAD
<<<<<<< HEAD
                    <Text size="sm">{tag}</Text>
=======
                    <Text size="sm">{tag.toUpperCase()}</Text>
                  </DismissibleTag>
                </span>
              ))}
              {existingTags.map((tag, index) => (
                <span key={index}>
                  <DismissibleTag
                    className="fr-ml-1w fr-mr-1v fr-mt-1w"
                    size="sm"
                    onClick={() => handleTagDelete(tag)}
                  >
                    <Text size="sm">{tag.toUpperCase()}</Text>
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
                    <Text size="sm">{tag}</Text>
>>>>>>> 8758832 (fix(edit-contrib): fix bug)
                  </DismissibleTag>
                </span>
              ))}
            </Col>
          </Row>
          <Row gutters>
            <Col md="6">
              <TextArea
<<<<<<< HEAD
<<<<<<< HEAD
                label="Ajouter des extra"
                value={inputs.extra}
                onChange={(e) => handleInputChange("extra", e.target.value)}
                hint="Exemple : clé: valeur"
=======
                label="Ajouter un idref"
                value={inputs.idRef}
                onChange={handleIdRefChange}
=======
                label="Ajouter un idRef"
                value={inputs.idref}
                onChange={(e) => handleInputChange("idref", e.target.value)}
>>>>>>> 8758832 (fix(edit-contrib): fix bug)
                hint="Ajoutez un identifiant"
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
              />
            </Col>
            <Col md="6">
              <TextArea
                label="Commentaire"
                value={inputs.comment}
<<<<<<< HEAD
<<<<<<< HEAD
                onChange={(e) => handleInputChange("comment", e.target.value)}
=======
                onChange={handleCommentChange}
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
                onChange={(e) => handleInputChange("comment", e.target.value)}
>>>>>>> 8758832 (fix(edit-contrib): fix bug)
                hint="Ajouter un commentaire"
              />
            </Col>
          </Row>
          <Row className="fr-btn-group fr-btn-group--right fr-mt-4w">
            <Button variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Enregistrer
            </Button>
          </Row>
        </ModalContent>
      </Modal>
      {showProfileModal && (
        <ProfileModal
          isOpen={showProfileModal}
          selectedProfile={selectedProfile}
          onClose={() => setShowProfileModal(false)}
<<<<<<< HEAD
<<<<<<< HEAD
          onSelectProfile={(profile) => handleInputChange("team", [profile])}
=======
          onSelectProfile={handleProfileSelect}
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
          onSelectProfile={(profile) => handleInputChange("team", [profile])}
>>>>>>> 8758832 (fix(edit-contrib): fix bug)
        />
      )}
      <TagSelectionModal
        isOpen={showTagModal}
        allTags={filteredTags}
<<<<<<< HEAD
<<<<<<< HEAD
        onClose={(selectedTags) => handleInputChange("tags", selectedTags)}
=======
        onClose={handleTagModalClose}
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
        onClose={(selectedTags) => handleInputChange("tags", selectedTags)}
>>>>>>> 8758832 (fix(edit-contrib): fix bug)
      />
    </>
  );
};

export default EditModal;
