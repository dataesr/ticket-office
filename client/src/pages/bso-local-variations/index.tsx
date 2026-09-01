import { Col, Container, Row, Text } from "@dataesr/dsfr-plus"
import { useCallback } from "react"
import { ClipLoader } from "react-spinners"

import BottomPaginationButtons from "../../components/pagination/bottom-buttons"
import ActionBar from "./components/actions-bar"
import CheckboxList from "./components/checkbox-list"
import FiltersBar from "./components/filters-bar"
import VariationItem from "./components/variation-item"
import { useVariationsContext, VariationsContext } from "./context"
import useUrl from "./hooks/useUrl"
import { Variation, VariationsTypes } from "./types"
import "./styles/styles.scss"

function BsoLocalVariationsPage() {
  const { currentCode, currentPage, handlePageChange } = useUrl()
  const {
    data: { data, isLoading, isError, refetch },
    checkedIds,
    selectedId,
    getCodeFromBSO,
  } = useVariationsContext()

  const filterVariations = useCallback(
    ({ structure: { id } }: Variation) => {
      if (currentCode === "choose" || currentCode === getCodeFromBSO(id)) return true
      return false
    },
    [currentCode]
  )

  const variations: Variation[] = data?.data?.filter(filterVariations) || []
  const meta = data?.meta
  const maxPage = meta ? Math.ceil(meta.total / 10) : 1

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
    <Container className="fr-py-6w">
      <Row gutters>
        <Col md="4" xs="12">
          <CheckboxList variations={variations} />
        </Col>
        <Col md="8" xs="12">
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

export default function BsoLocalVariations({ type }: { type: VariationsTypes }) {
  const title = `Demandes de déclinaisons locales - ${
    type.charAt(0).toUpperCase() + type.slice(1)
  }`

  return (
    <VariationsContext>
      <main id="content" className="bso-top-page">
        <section className="bso-top-page__banner">
          <div className="fr-container fr-py-8w">
            <h1 className="fr-mb-1w">{title}</h1>
            <p className="fr-mb-3w fr-text--sm">
              Recherchez et traitez les demandes de déclinaisons locales du BSO.
            </p>
            <FiltersBar />
          </div>
        </section>
        <BsoLocalVariationsPage />
      </main>
    </VariationsContext>
  )
}
