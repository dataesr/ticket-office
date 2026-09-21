import { Container, Link, Logo } from "@dataesr/dsfr-plus"

import { version } from "../../../package.json"
import {
  Footer,
  FooterBody,
  FooterBottom,
  FooterTop,
} from "../components/footer"
import SwitchTheme from "./switch-theme"

export default function MainFooter() {
  return (
    <Footer fluid={true}>
      <FooterTop>
        <Container>Le Guichet Numérique du DISD</Container>
      </FooterTop>
      <FooterBody>
        <Logo
          splitCharacter="|"
          text="Ministère|de l'enseignement|supérieur|de la recherche et de l'espace"
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
        <li className="fr-footer__bottom-item">
          <button
            aria-controls="fr-theme-modal"
            className="fr-footer__bottom-link fr-icon-theme-fill fr-btn--icon-left"
            data-fr-opened="false"
          >
            Paramètres d'affichage
          </button>
        </li>
        <li className="fr-footer__bottom-item">
          <a className="fr-footer__bottom-link" href={`https://github.com/dataesr/ticket-office/releases/tag/v${version}`} target='_blank'>
            Version de l'application {version}
          </a>
        </li>
      </FooterBottom>
      <SwitchTheme />
    </Footer>
  );
}
