import { Button, Col, Row, TextArea, ButtonGroup } from "@dataesr/dsfr-plus";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { postHeaders } from "../../config/api";

function EmailForm({
  userResponse,
  setUserResponse,
  handlePreview,
  sendEmail,
  contribution,
}) {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [tags, setTags] = useState<string[]>(contribution?.tags || []);

  const templates = [
    { label: "Accès API scanR", value: "API" },
    { label: "scanR Ne gère pas cela", value: "HS" },
    { label: "Mauvais interlocuteur", value: "INTERLOCUTEUR" },
    { label: "Merci !", value: "REMERCIEMENT" },
    { label: "Accès thèse", value: "THESE" },
    { label: "Accès documents", value: "DOCUMENTS" },
    { label: "Mise à jour", value: "MAJ" },
    { label: "Publication liées", value: "PUBLICATION" },
    { label: "Contenue retiré", value: "SUPRESSION" },
    { label: "Mise en relation", value: "MISE EN RELATION" },
  ];

  let basePath = "contacts";

  if (window.location.pathname.includes("contributionPage")) {
    basePath = "contribute";
  }
  if (window.location.pathname.includes("scanr-removeuser")) {
    basePath = "remove-user";
  }
  if (window.location.pathname.includes("scanr-namechange")) {
    basePath = "update-user-data";
  } else if (window.location.pathname.includes("apioperations")) {
    basePath = "production";
  }

  const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
  const baseURL = import.meta.env.VITE_BASE_API_URL;
  const url = isDevelopment
    ? `http://localhost:3000/api/${basePath}/${contribution?.id}`
    : `${baseURL}/api/${basePath}/${contribution?.id}`;

  const { mutate: updateTags } = useMutation<void, unknown, string[]>(
    async (updatedTags: string[]) => {
      const response = await fetch(`${url}`, {
        method: "PATCH",
        headers: postHeaders,
        body: JSON.stringify({ tags: updatedTags }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du tag.");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        toast.success("Tag ajouté avec succès !");
      },
      onError: () => {
        toast.error("Erreur lors de l'ajout du tag.");
      },
    }
  );

  const handleTemplateChange = (e) => {
    const value = e.target.value;
    setSelectedTemplate(value);

    switch (value) {
      case "API":
        setUserResponse(`Bonjour, 
          L'accès aux API scanR est possible avec le compte [Identifiant] et le mot de passe [Mot de passe]. 
          Les API sont documentées ici https://scanr.enseignementsup-recherche.gouv.fr/docs/overview. 
          N'hésitez pas à nous solliciter pour des compléments d'informations.
          Cordialement, 
          Département Ingénierie et science des données`);
        break;
      case "HS":
        setUserResponse(
          `Bonjour, désolé scanR ne gère pas cela. Cordialement L'équipe scanR`
        );
        break;
      case "INTERLOCUTEUR":
        setUserResponse(
          `Bonjour, Il faut vous adresser directement au laboratoire de votre choix. Votre message via scanR ne parvient qu'aux gestionnaires de l'application scanR (et pas au laboratoire). Pour joindre les laboratoires, partez plutôt de leur site web propre. Cordialement L'équipe scanR`
        );
        break;
      case "REMERCIEMENT":
        setUserResponse(
          `Bonjour, merci pour ce retour encourageant ! Cordialement L'équipe scanR`
        );
        break;
      case "THESE":
        setUserResponse(
          `Bonjour, Vous trouverez ici XXXXXXXXXXXXXXXXXXXX les renseignements pour accéder à la thèse. Cordialement L'équipe scanR`
        );
        break;
      case "DOCUMENTS":
        setUserResponse(
          `Bonjour, scanR ne dispose pas des documents indexés, mais uniquement des métadonnées les décrivant. Cordialement L'équipe scanR`
        );
        break;
      case "MAJ":
        setUserResponse(
          `Bonjour, Merci pour ce signalement. Les modifications seront visibles à la prochaine actualisation du site, d'ici quelques semaines. Cordialement L'équipe scanR`
        );
        break;
      case "PUBLICATION":
        setUserResponse(
          `Bonjour, Merci pour votre contribution. Les publications seront associées à la fiche-auteur à l'occasion de la prochaine mise à jour. Cordialement L'équipe scanR`
        );
        break;
      case "SUPRESSION":
        setUserResponse(
          `Bonjour, votre thèse et votre profil auteur ont bien été retirés. Cordialement L'équipe scanR`
        );
        break;
      case "MISE EN RELATION":
        setUserResponse(
          `Bonjour, scanR n'est pas une plateforme de mise en relation. Votre message parvient à scanR qui est un agrégateur de métadonnées liées à la recherche et à l'innovation. Cordialement L'équipe scanR`
        );
        break;
      default:
        break;
    }

    if (value && !tags.includes(value)) {
      const updatedTags = [...tags, value];
      setTags(updatedTags);
      updateTags(updatedTags);
    }
  };

  return (
    <>
      {contribution?.email && (
        <Row gutters>
          <Col offsetMd="2" md="10" xs="12">
            <label htmlFor="templateSelect">
              Choisissez un template de réponse
            </label>
            <select
              id="templateSelect"
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className="fr-select"
            >
              <option value="">Sélectionnez un template</option>
              {templates.map((template) => (
                <option key={template.value} value={template.value}>
                  {template.label}
                </option>
              ))}
            </select>
            <TextArea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Votre réponse..."
              rows={5}
            />
          </Col>
          <Col offsetMd="10" md="2" xs="12">
            <ButtonGroup size="sm">
              <Button
                className="fr-mt-1w"
                variant="secondary"
                onClick={handlePreview}
              >
                Prévisualiser le mail
              </Button>
              <Button
                className="fr-mt-1w"
                variant="primary"
                onClick={sendEmail}
              >
                {contribution?.mailSent ? "Renvoyer un mail" : "Répondre"}
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      )}
    </>
  );
}

export default EmailForm;
