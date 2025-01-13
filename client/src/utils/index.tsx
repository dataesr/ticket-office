export const BadgeColor = ({ type }) => {
  let badgeColor;
  switch (type) {
    case "structures":
      badgeColor = "blue-cumulus";
      break;
    case "persons":
      badgeColor = "purple-glycine";
      break;
    case "publications":
      badgeColor = "pink-tuile";
      break;
    case "project":
      badgeColor = "green-emeraude";
      break;
    case "patent":
      badgeColor = "green-tilleul-verveine";
      break;
    case "network":
      badgeColor = "orange-terre-battue";
      break;
    default:
      badgeColor = "purple-glycine";
  }
  return badgeColor;
};

export const BadgeStatus = ({ status }) => {
  let badgeStatus;
  switch (status) {
    case "new":
      badgeStatus = "pink-tuile";
      break;
    case "treated":
      badgeStatus = "green-bourgeon";
      break;
    case "ongoing":
      badgeStatus = "brown-cafe-creme";
      break;

    default:
      badgeStatus = "purple-glycine";
  }
  return badgeStatus;
};

export const StatusLabel = ({ status }) => {
  let statusLabel;
  switch (status) {
    case "new":
      statusLabel = "Nouveau";
      break;
    case "treated":
      statusLabel = "Traité";
      break;
    case "ongoing":
      statusLabel = "En cours";
      break;

    default:
      statusLabel = "purple-glycine";
  }
  return statusLabel;
};

export const TypeLabel = ({ type }) => {
  let typeLabel;
  switch (type) {
    case "persons":
      typeLabel = "Personnes";
      break;
    case "structures":
      typeLabel = "Structures";
      break;
    case "publications":
      typeLabel = "Publications";
      break;
    case "productions":
      typeLabel = "Production";
      break;
    case "projects":
      typeLabel = "Projets";
      break;
    case "network":
      typeLabel = "Network";
      break;
    default:
      typeLabel = "";
  }
  return typeLabel;
};

export const typeIcon = ({ icon }) => {
  let typeIcon;
  switch (icon) {
    case "persons":
      typeIcon = "user-fill";
      break;
    case "structures":
      typeIcon = "building-fill";
      break;
    case "publications":
      typeIcon = "article-fill";
      break;
    case "production":
      typeIcon = "git-commit-fill";
      break;
    case "projects":
      typeIcon = "recycle-fill";
      break;
    case "network":
      typeIcon = "git-branch-line";
      break;
    default:
      typeIcon = "";
  }
  return typeIcon;
};
