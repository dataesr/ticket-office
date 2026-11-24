import { Container, Text, Title } from "@dataesr/dsfr-plus";

type PageBannerProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export default function PageBanner({
  title,
  description,
  children,
}: PageBannerProps) {
  return (
    <Container as="section" fluid className="fr-background-alt--blue-france">
      <Container className="fr-py-8w">
        <Title as="h1" className="fr-mb-1w">
          {title}
        </Title>
        <Text size="sm" className={children ? "fr-mb-3w" : "fr-mb-0"}>
          {description}
        </Text>
        {children}
      </Container>
    </Container>
  );
}
