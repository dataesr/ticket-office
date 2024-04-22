import { Accordion, AccordionGroup, Container, Text } from "@dataesr/dsfr-plus";

export default function ContactPage() {
  return (
    <Container>
      <AccordionGroup className="fr-my-5w">
        <Accordion title="h1">
          {" "}
          <span>Contribution via formulaire contact</span>{" "}
        </Accordion>

        <Text>Coucou par contribution via le formulaire de contact</Text>
      </AccordionGroup>
    </Container>
  );
}
