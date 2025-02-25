import { DSFRColors } from "@dataesr/dsfr-plus"

type VARIATION_TAGS_TYPE = { [tag: string]: { [key: string]: { name: string; color: DSFRColors; icon: string } } }

export const VARIATION_TAGS: VARIATION_TAGS_TYPE = {
  file: {
    none: {
      name: "Aucune action réalisée",
      color: "beige-gris-galet",
      icon: "close-line",
    },
    uploaded: {
      name: "Importé sur OVH",
      color: "success",
      icon: "success-line",
    },
  },
  code: {
    none: {
      name: "Aucune action réalisée",
      color: "beige-gris-galet",
      icon: "close-line",
    },
    staging: {
      name: "Disponible en staging",
      color: "yellow-tournesol",
      icon: "refresh-line",
    },
    production: {
      name: "Disponible en production",
      color: "success",
      icon: "success-line",
    },
  },
  index: {
    none: {
      name: "Aucune action réalisée",
      color: "beige-gris-galet",
      icon: "close-line",
    },
    ongoing: {
      name: "Création en cours",
      color: "yellow-tournesol",
      icon: "refresh-line",
    },
    failed: {
      name: "Erreur lors de la création",
      color: "error",
      icon: "error",
    },
    finalized: {
      name: "Création finalisée",
      color: "success",
      icon: "success",
    },
  },
  notification: {
    none: {
      name: "Aucun message envoyé",
      color: "beige-gris-galet",
      icon: "close-line",
    },
    ongoing: {
      name: "Message de traitement envoyé",
      color: "yellow-tournesol",
      icon: "refresh-line",
    },
    done: {
      name: "Message de disponibilité envoyé",
      color: "success",
      icon: "success",
    },
  },
}

export const tagGetColor = (tag: string, status: string) => VARIATION_TAGS?.[tag]?.[status]?.color || "beige-gris-galet"
export const tagGetIcon = (tag: string, status: string) => VARIATION_TAGS?.[tag]?.[status]?.icon || "close-line"
export const tagGetName = (tag: string, status: string) => VARIATION_TAGS?.[tag]?.[status]?.name || "Aucune action réalisée"
