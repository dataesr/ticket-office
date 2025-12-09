export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}m ${secs}s`;
};

export const formatNumber = (num: number) =>
  new Intl.NumberFormat("fr-FR").format(num);

export const getPeriodLabel = (period: "day" | "week" | "month" | "year") => {
  switch (period) {
    case "day":
      return "Aujourd'hui";
    case "week":
      return "Cette semaine";
    case "month":
      return "Ce mois-ci";
    case "year":
      return "Cette année";
    default:
      return "";
  }
};

export const getDeviceIcon = (label: string) => {
  const icons: Record<string, string> = {
    desktop: "🖥️",
    mobile: "📱",
    tablet: "📱 tablet",
    tv: "📺",
  };
  return icons[label.toLowerCase()] || "💻";
};

export const getReferrerLabel = (label: string) => {
  const labels: Record<string, string> = {
    search: "🔍 Moteur de recherche",
    website: "🌐 Site web",
    direct: "🚀 Accès direct",
    campaign: "📢 Campagne",
    social: "💬 Réseaux sociaux",
  };
  return labels[label.toLowerCase()] || label;
};
