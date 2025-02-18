export interface Variation {
  id: string
  contact: {
    email: string
  }
  structure: {
    name: string
    id?: string
  }
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
  file: "none" | "uploaded"
  code: "none" | "staging" | "production"
  index: "none" | "ongoing" | "failed" | "finalized"
  notification: "none" | "ongoing" | "done"
}

export type EditModalProps = {
  isOpen: boolean
  onClose: () => void
  variation: Variation
  refetch: () => void
}

export type EditModalInputs = {
  status?: string
  tags?: VariationTags
  team: string[]
  comment?: string
}
