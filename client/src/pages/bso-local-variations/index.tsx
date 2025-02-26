import { Col, Container, Row, Text, Title } from "@dataesr/dsfr-plus"
import VariationItem from "./components/variation-item"
import { ClipLoader } from "react-spinners"
import { Variation } from "./types"
import BottomPaginationButtons from "../../components/pagination/bottom-buttons"
import useUrl from "./hooks/useUrl"
import CheckboxList from "./components/checkbox-list"
import { useVariationsContext, VariationsContext } from "./context"
import ActionBar from "./components/actions-bar"
import FiltersBar from "./components/filters-bar"

function BSOLocalVariationsPage() {
  const { currentPage, handlePageChange } = useUrl()
  const {
    data: { data, isLoading, isError, refetch },
    checkedIds,
    selectedId,
  } = useVariationsContext()

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

  console.log("checkedIds", checkedIds)
  const selectedVariation = variations?.find((variation) => variation?.id === selectedId) || variations?.[0]

  return (
    <Container className="fr-my-5w">
      <Title>Demandes de déclinaisons locales</Title>
      <FiltersBar />
      <Row>
        <Col md="4" xs="12">
          <CheckboxList variations={variations} />
        </Col>
        <Col md="7" xs="12">
          {!checkedIds.length && selectedVariation && (
            <VariationItem key={selectedVariation.id} variation={selectedVariation} refetch={refetch} />
          )}
          {!!checkedIds.length && (
            <ActionBar variations={variations.filter((variation) => checkedIds.includes(variation.id))} />
          )}
        </Col>
      </Row>
      <BottomPaginationButtons page={currentPage} maxPage={maxPage} setPage={handlePageChange} />
    </Container>
  )
}

export default function BSOLocalVariations() {
  return (
    <VariationsContext>
      <BSOLocalVariationsPage />
    </VariationsContext>
  )
}
