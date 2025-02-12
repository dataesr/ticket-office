export interface BSOContribution {
  id: string;
  type: string;
  status: string;
  email: string;
  tags: string[];
  name: string;
  comment?: string;
  team?: string[];
  created_at: string;
  threads?: {
    responses: {
      team: string;
    }[];
  }[];
}

export interface BSOContributionItemProps {
  contribution: BSOContribution;
}

export interface BSOContributorSummaryProps {
  contributions: BSOContribution[];
  onSelectContribution: (id: string) => void;
}
