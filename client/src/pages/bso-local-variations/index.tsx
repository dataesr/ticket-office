import { Col, Container, Row, Text, Title } from "@dataesr/dsfr-plus"
import TopPaginationButtons from "../../components/pagination/top-buttons"
import Selectors from "../../components/selectors"
import VariationItem from "./components/variation-item"
import { ClipLoader } from "react-spinners"
import { Variation } from "./types"
import SearchSection from "../contact-contributionbyobject-page/components/search-section"
import BottomPaginationButtons from "../../components/pagination/bottom-buttons"
import useUrl from "./hooks/useUrl"
import ActionBar from "./components/actions-bar"
import CheckboxList from "./components/checkbox-list"
import { useVariationsContext, VariationsContext } from "./context"

function BSOLocalVariationsPage() {
  const {
    currentSort,
    currentQuery,
    currentPage,
    currentStatus,
    handleSortChange,
    handleQueryChange,
    handlePageChange,
    handleStatusChange,
    removeQueryItem,
  } = useUrl()
  const {
    data: { data, isLoading, isError, refetch },
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

  const selectedVariation = variations?.find((variation) => variation?.id === selectedId) || variations?.[0]

  return (
    <Container className="fr-my-5w">
      <Title>Demandes de déclinaisons locales</Title>
      <Row gutters className="fr-mb-3w">
        <Col md="8" xs="12">
          <SearchSection query={currentQuery} handleSearch={handleQueryChange} handleRemoveQueryItem={removeQueryItem} />
          <TopPaginationButtons meta={meta} page={currentPage} maxPage={maxPage} setPage={handlePageChange} />
        </Col>
        <Col offsetLg="1">
          <Selectors
            sort={currentSort}
            status={currentStatus}
            setSort={handleSortChange}
            setStatus={handleStatusChange}
            searchInMessage={null}
            setSearchInMessage={null}
          />
        </Col>
      </Row>
      <ActionBar />
      <Row>
        <Col md="4" xs="12">
          <CheckboxList variations={variations} />
        </Col>
        <Col md="7" xs="12">
          {selectedVariation && <VariationItem key={selectedVariation.id} variation={selectedVariation} refetch={refetch} />}
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
