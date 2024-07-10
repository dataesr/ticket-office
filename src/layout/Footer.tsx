import { Container, Link, Logo } from "@dataesr/dsfr-plus";


import SwitchTheme from "./switch-theme";
import { Footer, FooterBody, FooterBottom, FooterTop } from "../components/footer";

export default function MainFooter() {
  return (
    <Footer fluid={true}>
      <FooterTop>
        <Container>Le Guichet Numérique du DISD</Container>
      </FooterTop>
      <FooterBody>
        <Logo
          splitCharacter="|"
          text="Ministère|de l'enseignement|supérieur|et de la recherche"
        />
        <Link
          className="fr-footer__content-link"
          target="_blank"
          rel="noreferrer noopener external"
          title="[À MODIFIER - Intitulé] - nouvelle fenêtre"
          href="https://legifrance.gouv.fr"
        >
          legifrance.gouv.fr
        </Link>
        <Link
          className="fr-footer__content-link"
          target="_blank"
          rel="noreferrer noopener external"
          title="[À MODIFIER - Intitulé] - nouvelle fenêtre"
          href="https://gouvernement.fr"
        >
          gouvernement.fr
        </Link>
        <Link
          className="fr-footer__content-link"
          target="_blank"
          rel="noreferrer noopener external"
          title="[À MODIFIER - Intitulé] - nouvelle fenêtre"
          href="https://service-public.fr"
        >
          service-public.fr
        </Link>
        <Link
          className="fr-footer__content-link"
          target="_blank"
          rel="noreferrer noopener external"
          title="[À MODIFIER - Intitulé] - nouvelle fenêtre"
          href="https://data.gouv.fr"
        >
          data.gouv.fr
        </Link>
      </FooterBody>
      <FooterBottom>
        <button
          className="fr-footer__bottom-link fr-icon-theme-fill fr-btn--icon-left"
          aria-controls="fr-theme-modal"
          data-fr-opened="false"
        >
          Paramètres d'affichage
        </button>
      </FooterBottom>
      <SwitchTheme />
    </Footer>
  );
}
