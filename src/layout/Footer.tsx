import { Container, Link, Logo } from "@dataesr/dsfr-plus";

import {
  Footer,
  FooterBody,
  FooterBottom,
  FooterTop,
} from "../components/footer";
import SwitchTheme from "./switch-theme";

export default function MainFooter() {
  return (
    <Footer fluid={true}>
      <FooterTop>
        <Container>
          Ceci est un footer (mais on sait pas quoi mettre dedans)
        </Container>
      </FooterTop>
      <FooterBody description="coucou">
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
        <button className="fr-footer__bottom-link" data-fr-opened="false">
          "coucou1"
        </button>
        <button
          className="fr-footer__bottom-link fr-icon-theme-fill fr-btn--icon-left"
          aria-controls="fr-theme-modal"
          data-fr-opened="false"
        >
          "coucou2"
        </button>
        <Link
          target="_blank"
          rel="noreferer noopenner"
          className="fr-footer__bottom-link"
        >
          "coucou3"
        </Link>
      </FooterBottom>
      <SwitchTheme />
    </Footer>
  );
}
