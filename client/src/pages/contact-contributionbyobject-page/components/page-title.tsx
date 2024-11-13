import { Title } from "@dataesr/dsfr-plus";

const PageTitle: React.FC<{ pathname: string }> = ({ pathname }) => {
  const getTitle = () => {
    if (pathname.includes("contributionPage")) return "Contribution par objets";
    if (pathname.includes("removeuser")) return "Demande de suppression";
    if (pathname.includes("namechange")) return "Demande de changement de nom";
    return "Contribution via formulaire de contact";
  };

  return <Title as="h1">{getTitle()}</Title>;
};

export default PageTitle;
