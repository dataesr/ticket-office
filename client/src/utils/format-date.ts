export const formatDate = (value: string | number | Date) =>
  new Date(value).toLocaleDateString("fr-FR");

export const formatTime = (value: string | number | Date) =>
  new Date(value).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
