import { DSFRColors } from "@dataesr/dsfr-plus"

type VARIATION_TAGS_TYPE = { [tag: string]: { [key: string]: { name: string; color: DSFRColors; icon: string } } }

export const VARIATION_TAGS: VARIATION_TAGS_TYPE = {
  file: {
    none: {
      name: "Fichier non importé",
      color: "beige-gris-galet",
      icon: "close-line",
    },
    uploaded: {
      name: "Fichier importé sur OVH",
      color: "success",
      icon: "success-line",
    },
  },
  code: {
    none: {
      name: "Config non présente",
      color: "beige-gris-galet",
      icon: "close-line",
    },
    staging: {
      name: "Config en staging",
      color: "yellow-tournesol",
      icon: "refresh-line",
    },
    production: {
      name: "Config en production",
      color: "success",
      icon: "success-line",
    },
  },
  index: {
    none: {
      name: "Index non créé",
      color: "beige-gris-galet",
      icon: "close-line",
    },
    ongoing: {
      name: "Index en création",
      color: "yellow-tournesol",
      icon: "refresh-line",
    },
    failed: {
      name: "Index en erreur",
      color: "error",
      icon: "error",
    },
    finalized: {
      name: "Index finalisé",
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
