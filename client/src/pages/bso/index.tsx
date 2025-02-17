import { useState } from "react"
import { Col, Container, Row, Text, Title } from "@dataesr/dsfr-plus"
import { variationsUrl } from "../../config/api"
import ContributionData from "../../api/contribution-api/getData"
import TopPaginationButtons from "../../components/pagination/top-buttons"
import Selectors from "../../components/selectors"
import VariationsSummary from "./components/variations-summary"
import VariationItem from "./components/variation-item"
import { ClipLoader } from "react-spinners"
import { Variation } from "./types"

const LocalBSO = () => {
  const [sort, setSort] = useState<string>("DESC")
  const [status, setStatus] = useState<string>("choose")
  const [page, setPage] = useState<number>(1)
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(null)
  const { data, isLoading, isError, refetch } = ContributionData(variationsUrl)

  const handleSelectVariation = (id: string) => {
    setSelectedVariationId(id)
  }

  const variations: Variation[] = data ? data.data : []
  const meta = data?.meta
  const maxPage = meta ? Math.ceil(meta.total / 10) : 1

  console.log("variations", variations)

  if (isLoading) {
    return (
      <div className="loading-container">
        <ClipLoader color="#123abc" size={50} />
      </div>
    )
  }

  if (isError)
    return (
      <Container className="fr-my-5w">
        <Text>Erreur lors du chargement des données.</Text>
      </Container>
    )

  const selectedVariation = variations?.find((variation) => variation?.id === selectedVariationId) || variations?.[0]

  return (
    <Container className="fr-my-5w">
      <Title>Demandes de déclinaisons locales</Title>
      <Row gutters className="fr-mb-3w">
        <Col md="8" xs="12">
          <TopPaginationButtons meta={meta} page={page} maxPage={maxPage} setPage={setPage} />
        </Col>
        <Col offsetLg="1">
          <Selectors
            sort={sort}
            status={status}
            setSort={setSort}
            setStatus={setStatus}
            searchInMessage={null}
            setSearchInMessage={null}
          />
        </Col>
      </Row>
      <Row>
        <Col md="4" xs="12">
          <VariationsSummary variations={variations} onSelectedVariation={handleSelectVariation} />
        </Col>
        <Col md="7" xs="12">
          {selectedVariation && <VariationItem key={selectedVariation.id} variation={selectedVariation} refetch={refetch} />}
          <div className="fr-mt-10w">
            {/* <StaffActions
              data={fakeVariations.find(
                (variation) => variation?.id === variation?.id
              )}
            /> */}
          </div>
        </Col>
      </Row>

      {/* <BottomPaginationButtons
      page={page}
      maxPage={maxPage}
      setPage={setPage}
      /> */}
    </Container>
  )
}

export default LocalBSO
