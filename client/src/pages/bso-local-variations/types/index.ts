export interface Variation {
  id: string
  contact: {
    email: string
  }
  structure: {
    name: string
    id?: string
  }
  csv: string
  tags: VariationTags
  status: string
  created_at: string
  modified_at: string
  treated_at: string
  team?: string[]
  comment?: string
}

export interface VariationItemProps {
  variation: Variation
  refetch: () => void
}

export interface VariationsSummaryProps {
  variations: Variation[]
  onSelectedVariation: (id: string) => void
}

export type VariationTags = {
  file?: string
  index?: string
  notification?: string
}

export type EditModalProps = {
  isOpen: boolean
  onClose: () => void
  variations: Array<Variation>
}

export type EditModalInputs = {
  contact?: { email?: string }
  structure?: { id?: string; name?: string }
  status?: string
  tags?: VariationTags
  comment?: string
  team?: string
}
