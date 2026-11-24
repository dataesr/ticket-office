import { useId, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button, ButtonGroup, TextArea } from "@dataesr/dsfr-plus";
import { postHeaders } from "../../config/api";

const TEMPLATES = [
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

const TEMPLATE_MESSAGES: Record<string, string> = {
  API: `Bonjour,
          L'accès aux API scanR est possible avec le compte [Identifiant] et le mot de passe [Mot de passe].
          Les API sont documentées ici https://scanr.enseignementsup-recherche.gouv.fr/docs/overview.
          N'hésitez pas à nous solliciter pour des compléments d'informations.
          Cordialement,
          Département Ingénierie et science des données`,
  HS: "Bonjour, désolé scanR ne gère pas cela. Cordialement L'équipe scanR",
  INTERLOCUTEUR:
    "Bonjour, Il faut vous adresser directement au laboratoire de votre choix. Votre message via scanR ne parvient qu'aux gestionnaires de l'application scanR (et pas au laboratoire). Pour joindre les laboratoires, partez plutôt de leur site web propre. Cordialement L'équipe scanR",
  REMERCIEMENT:
    "Bonjour, merci pour ce retour encourageant ! Cordialement L'équipe scanR",
  THESE:
    "Bonjour, Vous trouverez ici XXXXXXXXXXXXXXXXXXXX les renseignements pour accéder à la thèse. Cordialement L'équipe scanR",
  DOCUMENTS:
    "Bonjour, scanR ne dispose pas des documents indexés, mais uniquement des métadonnées les décrivant. Cordialement L'équipe scanR",
  MAJ: "Bonjour, Merci pour ce signalement. Les modifications seront visibles à la prochaine actualisation du site, d'ici quelques semaines. Cordialement L'équipe scanR",
  PUBLICATION:
    "Bonjour, Merci pour votre contribution. Les publications seront associées à la fiche-auteur à l'occasion de la prochaine mise à jour. Cordialement L'équipe scanR",
  SUPRESSION:
    "Bonjour, votre thèse et votre profil auteur ont bien été retirés. Cordialement L'équipe scanR",
  "MISE EN RELATION":
    "Bonjour, scanR n'est pas une plateforme de mise en relation. Votre message parvient à scanR qui est un agrégateur de métadonnées liées à la recherche et à l'innovation. Cordialement L'équipe scanR",
};

function EmailForm({
  userResponse,
  setUserResponse,
  handlePreview,
  sendEmail,
  contribution,
  apiRoute,
}) {
  const templateSelectId = useId();
  const responseTextareaId = useId();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [tags, setTags] = useState<string[]>(contribution?.tags || []);

  const url = `/api/${apiRoute}/${contribution?.id}`;

  const { mutate: updateTags } = useMutation({
    mutationFn: async (updatedTags: string[]) => {
      const response = await fetch(url, {
        method: "PATCH",
        headers: postHeaders,
        body: JSON.stringify({ tags: updatedTags }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du tag.");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Tag ajouté avec succès !");
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout du tag.");
    },
  });

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTemplate(value);

    if (TEMPLATE_MESSAGES[value]) {
      setUserResponse(TEMPLATE_MESSAGES[value]);
    }

    if (value && !tags.includes(value)) {
      const updatedTags = [...tags, value];
      setTags(updatedTags);
      updateTags(updatedTags);
    }
  };

  if (!contribution?.email) return null;

  return (
    <>
      <hr className="fr-mt-3w" />
      <div className="fr-select-group fr-mb-3w">
        <select
          id={templateSelectId}
          className="fr-select"
          value={selectedTemplate}
          onChange={handleTemplateChange}
        >
          <option value="">Sélectionnez un template</option>
          {TEMPLATES.map((template) => (
            <option key={template.value} value={template.value}>
              {template.label}
            </option>
          ))}
        </select>
      </div>

      <TextArea
        id={responseTextareaId}
        className="fr-mb-3w"
        css={{ "fr-label": "fr-text--bold" }}
        label="Votre réponse"
        disableAutoValidation
        rows={6}
        placeholder="Votre réponse..."
        value={userResponse}
        onChange={(e) => setUserResponse(e.target.value)}
      />

      <ButtonGroup
        align="right"
        isReversed
        isInlineFrom="xs"
        className="fr-mb-0"
      >
        <Button
          type="button"
          icon="send-plane-line"
          iconPosition="left"
          onClick={sendEmail}
        >
          {contribution?.mailSent ? "Renvoyer un mail" : "Répondre"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          icon="eye-line"
          iconPosition="left"
          onClick={handlePreview}
        >
          Prévisualiser le mail
        </Button>
      </ButtonGroup>
    </>
  );
}

export default EmailForm;
