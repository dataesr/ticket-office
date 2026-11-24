import { Alert, Container, Text } from "@dataesr/dsfr-plus";
import Loader from "../../components/loader";
import PageBanner from "../../components/page-banner";
import { useCertificates } from "./api";
import CertificatesTable from "./components/certificates-table";
import UrgenceSummary from "./components/urgence-summary";

const Certificats = () => {
  const { data, isLoading, error } = useCertificates();

  return (
    <main id="content">
      <PageBanner
        title="Certificats"
        description="Surveillance de l'expiration des certificats SSL de nos applications"
      />
      <Container className="fr-py-6w">
        {isLoading && <Loader />}

        {error && (
          <Alert variant="error" title="Erreur" description={error.message} />
        )}

        {data && !isLoading && !error && (
          <>
            <Text size="sm" className="fr-text-mention--grey">
              Rapport généré le{" "}
              {new Date(data.date).toLocaleDateString("fr-FR")}
            </Text>
            <CertificatesTable certificates={data.certificates} />
            <UrgenceSummary certificates={data.certificates} />
          </>
        )}
      </Container>
    </main>
  );
};

export default Certificats;
