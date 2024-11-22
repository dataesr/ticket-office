import { MetaData } from "../../api-operation-page/types";

export interface Contribution {
  id: string;
  name: string;
  message: string;
  fromApplication: string;
  status: string;
  comment: string;
  team: string[];
  created_at: string;
  phone?: string;
  type: string;
  tags: string[];
  objectId: string;
  email: string;
  extra: Record<string, string>;
  treated_at: string;
  objectType: string;
  threads: Thread[];
}

export interface ContributionMeta extends MetaData {}

export interface ContributionDataResponse {
  data: Contribution[];
  meta: ContributionMeta;
}

export interface PaginationProps {
  page: number;
  maxPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export interface ContributorSummaryProps {
  contributions: Contribution[];
  onSelectContribution: (id: string) => void;
}

export interface SearchSectionProps {
  query: string[];
  handleSearch: (value: string) => void;
  handleRemoveQueryItem: (item: string) => void;
}

export interface ContributionDetailsProps {
  filteredContributions: Contribution[];
  selectedContribution: string;
  refetch: () => void;
  highlightedQuery: string;
  allTags: string[];
  url: string;
}

export interface ContributionPageProps {
  fromApplication?: string;
}

export interface ContributionDetailsProps {
  filteredContributions: Contribution[];
  selectedContribution: string;
  refetch: () => void;
  highlightedQuery: string;
  allTags: string[];
  url: string;
}

export interface ContributionItemProps {
  data: Contribution & {
    threads?: Thread[];
    tags?: string[];
    type?: string;
  };
  highlightedQuery: string;
  refetch: () => void;
  allTags: string[];
  url: string;
}

export interface ContributorInfoProps {
  data: Contribution;
  highlightedQuery: string;
  refetch: () => void;
  allTags: string[];
}

export interface ContributorSummaryProps {
  contributions: Contribution[];
  onSelectContribution: (id: string) => void;
}

export interface MessagePreviewProps {
  data: Contribution;
  highlightedQuery: string;
  refetch: () => void;
  allTags: string[];
}
export interface PageTitleProps {
  pathname: string;
}
export interface PaginationMeta {
  [key: string]: any;
}

export interface PaginationProps {
  page: number;
  maxPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export interface TopPaginationProps extends PaginationProps {
  meta: PaginationMeta;
}
export interface SearchSectionProps {
  query: string[];
  handleSearch: (value: string) => void;
  handleRemoveQueryItem: (item: string) => void;
}

export interface StaffActionsProps {
  data: Contribution;
  refetch: () => void;
  url: string;
}

export interface ThreadResponse {
  team: string[];
  timestamp: string;
  responseMessage: string;
}

export interface Thread {
  responses: ThreadResponse[];
}
