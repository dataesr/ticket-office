export const BadgeColor = ({ type }) => {
  let badgeColor;
  switch (type) {
    case "structures":
      badgeColor = "yellow-tournesol";
      break;
    case "persons":
      badgeColor = "orange-terre-battue";
      break;
    case "publications":
      badgeColor = "pink-macaron";
      break;
    case "project":
      badgeColor = "green-emeraude";
      break;
    case "patent":
      badgeColor = "blue-ecume";
      break;
    default:
      badgeColor = "purple-glycine";
  }
  return badgeColor;
};
