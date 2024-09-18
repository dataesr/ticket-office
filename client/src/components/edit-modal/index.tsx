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
  const [selectedProfile] = useState(localStorage.getItem("selectedProfile"));
  const [inputs, setInputs] = useState<Inputs>({
    team: [selectedProfile],
    status: "treated",
    tags: [],
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
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showTagModal, setShowTagModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("treated");

  let basePath = "contact";

  if (window.location.pathname.includes("contributionpage")) {
    basePath = "contribute";
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
  } else if (window.location.pathname.includes("apioperations")) {
    basePath = "production";
  }

  const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
  const url = isDevelopment
<<<<<<< HEAD
    ? `http://localhost:3000/api/${basePath}/${data?.id}`
    : `https://ticket-office.staging.dataesr.ovh/api/${basePath}/${data?.id}`;
=======
    ? `http://localhost:3000/api/${basePath}/${data?._id}`
    : `https://ticket-office.staging.dataesr.ovh/api/${basePath}/${data?._id}`;
  const [inputs, setInputs] = useState<Inputs>({
    team: [selectedProfile],
    status: "treated",
    tags: [],
    idRef: "",
    comment: "",
  });
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)

  useEffect(() => {
    if (!selectedProfile) {
      setShowProfileModal(true);
    }
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

  const handleStatusChange = (event) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      status: event.target.value,
    }));
  };

  const handleTagInputChange = () => {
    const tagsArray = tagInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const duplicateTags = tagsArray.filter((tag) => existingTags.includes(tag));

    if (duplicateTags.length > 0) {
      toast.warn(`Le tag ${duplicateTags.join(", ")} existe déjà!`);
      setTagInput("");
      return;
    }
    if (tagsArray.length > 0) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        tags: [...prevInputs.tags, ...tagsArray],
      }));
      setTagInput("");
    }
  };

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

      const response = await fetch(url, {
        method: "PATCH",
        headers: postHeaders,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.log("Erreur de réponse", response);
      } else {
        const responseData = await response.json();
        console.log("Données de réponse", responseData);
        refetch();
        onClose();

        if (inputs.tags.length > 0) {
          toast.success("Nouveau(x) tag(s) ajouté(s)!");
        } else if (inputs.comment) {
          toast.success("Nouveau commentaire ajouté!");
        } else if (inputs.idRef) {
          toast.success("Nouvel idRef ajouté!");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire", error);
    }
  };

  const statusOptions = [
    { value: "new", label: "Nouveau" },
    { value: "ongoing", label: "En traitement" },
    { value: "treated", label: "Traité" },
  ];

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
    localStorage.setItem("selectedProfile", profile);
    setShowProfileModal(false);
  };

  const handleTagAdd = () => {
    setShowTagModal(true);
  };

  const handleTagModalClose = (selectedTags: string[]) => {
    setShowTagModal(false);
    if (selectedTags.length > 0) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        tags: [...prevInputs.tags, ...selectedTags],
      }));
    }
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
  };

  return (
    <>
      <Modal isOpen={isOpen} hide={onClose}>
        <ModalTitle>Modifier la contribution</ModalTitle>
<<<<<<< HEAD
        <ModalContent>
=======
        <ModalContent className="profile-modal-content">
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
          <Col className="fr-mb-1w">
            <label htmlFor="statusInput">Statut</label>
            <select
              id="statusInput"
              name="status"
              value={inputs.status}
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
=======
              <Button onClick={handleTagAdd} variant="secondary" size="sm">
                Sélectionner des tags
              </Button>
              <br />
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
              {inputs.tags.map((tag, index) => (
                <span key={index}>
                  <DismissibleTag
                    size="sm"
                    className="fr-mt-1w"
                    onClick={() => handleTagRemove(tag)}
                  >
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
                  </DismissibleTag>
                </span>
              ))}
            </Col>
          </Row>
          <Row gutters>
            <Col md="6">
              <TextArea
<<<<<<< HEAD
                label="Ajouter des extra"
                value={inputs.extra}
                onChange={(e) => handleInputChange("extra", e.target.value)}
                hint="Exemple : clé: valeur"
=======
                label="Ajouter un idref"
                value={inputs.idRef}
                onChange={handleIdRefChange}
                hint="Ajoutez un identifiant"
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
              />
            </Col>
            <Col md="6">
              <TextArea
                label="Commentaire"
                value={inputs.comment}
<<<<<<< HEAD
                onChange={(e) => handleInputChange("comment", e.target.value)}
=======
                onChange={handleCommentChange}
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
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
          onSelectProfile={(profile) => handleInputChange("team", [profile])}
=======
          onSelectProfile={handleProfileSelect}
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
        />
      )}
      <TagSelectionModal
        isOpen={showTagModal}
        allTags={filteredTags}
<<<<<<< HEAD
        onClose={(selectedTags) => handleInputChange("tags", selectedTags)}
=======
        onClose={handleTagModalClose}
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
      />
    </>
  );
};

export default EditModal;
