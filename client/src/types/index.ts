export interface Response {
  attachments: boolean;
  read: boolean;
  responseMessage: string;
  timestamp: string;
  team?: string[];
}

export interface Thread {
  id: string;
  responses: Response[];
}

export interface Production {
  id: string;
  lastName?: string;
  firstName?: string;
  productionId?: string;
  fullName?: string;
  name?: string;
  treated?: boolean;
}

export interface BaseContribution {
  id: string;
  name: string;
  email: string;
  status: string;
  message: string;
  created_at: string;
  phone?: string;
  tags?: string[];
  comment?: string;
  team?: string[];
  modified_at?: string;
  fromApplication?: string;
  contributionType?: string;
  organisation?: string;
  fonction?: string;
  threads?: Thread[];
  extra?: Record<string, unknown>;
}

export interface Contribution extends BaseContribution {
  selectedProfile: string;
  objectType: string;
  type: string;
}

export interface Contribute_Production extends BaseContribution {
  objectId: string;
  productions: Production[];
  description?: string;
}

export interface UnifiedContribution {
  contact?: { email?: string };
  csv?: string;
  id: string;
  created_at: string;
  status?: string;
  name?: string;
  email?: string;
  message?: string;
  objectId?: string;
  objectType?: string;
  productions?: Production[];
  type?: string;
  comment?: string;
  tags?: string[];
  team?: string[];
  threads?: Thread[];
  fromApplication?: string;
  contributionType?: string;
}

export interface AuthorData {
  fullName: string[];
  firstName: string[];
  lastName: string[];
}

export interface Publication {
  hits: number;
  landingPage?: string;
}

export interface TagSelectionModalProps {
  isOpen: boolean;
  allTags: string[];
  onClose: (selectedTags: string[]) => void;
}

export interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Contribution | Contribute_Production;
  refetch: () => void;
  allTags: string[];
  dataProduction?: Contribute_Production[];
}

export interface ProfileModalProps {
  isOpen: boolean;
  selectedProfile: string | null;
  onClose: () => void;
  onSelectProfile: (profile: string) => void;
}

export interface EmailItem {
  images: Record<string, { contentType: string; base64: string }>;
  href: string;
  selectedProfile: string;
  _id: string;
  from: { name: string; address: string }[];
  subject: string;
  date: string;
  extractedText: string;
}



export interface Inputs {
  team: string[];
  status: string;
  tags: string[];
  comment: string;
  extra: string;
  contributionType?: string;
}

export interface DataListItem {
  publi_id: string;
  person_id?: string;
  export: boolean;
  fullName?: string;
}

export interface DataListContextType {
  dataList: DataListItem[];
  setDataList: React.Dispatch<React.SetStateAction<DataListItem[]>>;
}

export interface ExternalLinksProps {
  productionId: string;
  name: string;
  landingPages?: Record<string, string>;
}

export interface ContributorRequestsProps {
  data: Contribute_Production;
  coloredName: string;
  authorsData?: Record<string, any>;
  landingPages?: Record<string, string>;
  idrefNames?: Record<string, string>;
}

export interface SelectWithNamesProps {
  productionId: string;
  idRef: string;
  coloredName: string;
  contributionId: string;
  authorData?: {
    fullName?: string[];
    firstName?: string[];
    lastName?: string[];
  };
}

export interface MessagePreviewProps {
  data: any;
  highlightedQuery?: string;
}
export interface MessagePreviewProductionProps {
  data: any;
  highlightedQuery?: string;
  refetch: () => void;
  allTags: string[];
  authorsData: AuthorData;
  landingPages: Record<string, string>;
  idrefNames: Record<string, string>;
}

export interface ContributionProductionDataResponse {
  data: Contribute_Production[];
  meta: {
    total: number;
    page?: number;
    max_results?: number;
  };
  tags?: string[];
}

export interface ContributionProductionDataHookResponse {
  data: ContributionProductionDataResponse | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}
export interface SelectOption {
  value: string;
  label: string;
  firstName?: string;
  lastName?: string;
  isColored?: boolean;
}

export interface ContributionData {
  fullName: string;
  person_id: string;
  publi_id: string;
  contribution_id: string;
  first_name?: string;
  last_name?: string;
  export: boolean;
}

export interface ExtendedSelectWithNamesProps extends SelectWithNamesProps {
  authorData?: {
    fullName: string[];
    firstName: string[];
    lastName: string[];
  };
  landingPage?: string;
}


export interface ContributionProductionItemProps {
  data: {
    threads: any[];
    email: string;
    message: string;
    status?: string;
    tag?: string;
    productions: Production[];
    created_at: string;
    name: string;
    id: string;
  };
  refetch: () => void;
  allTags: string[];
  authorsData: any;
  landingPages: Record<string, string>;
  idrefNames: Record<string, string>;
}
export interface ExcelExportButtonProps {
  refetch: () => void;
}

export interface StaffProductionActionsProps {
  data?: {
    name: string;
    threads?: Array<{
      responses: Array<{
        team: string[];
        timestamp: string | number | Date;
        responseMessage: string;
      }>;
    }>;
  };
  refetch: () => void;
}

export interface ContributionDetailsProps {
  filteredContributions: any[];
  selectedContribution: string | number;
  refetch: () => void;
  highlightedQuery?: string;
  allTags: string[];
  url?: string;
}

export interface ContributorSummaryProps {
  contributions: {
    id: string;
    type?: string;
    status?: string;
    tags?: string[];
    name: string;
    created_at: string;
    message: string;
    threads?: Thread[];
  }[];
  selectedContribution?: string;
  onSelectContribution: (id: string) => void;
}

export interface PaginationProps {
  page: number;
  maxPage: number;
  setPage: (page: number) => void;
}

export interface TopPaginationProps extends PaginationProps {
  meta?: { total?: number };
}

export interface StaffActionsProps {
  url: string;
  refetch: () => void;
  data: Contribution;
}
export interface ContributionPageProps {
  fromApplication?: string;
}
