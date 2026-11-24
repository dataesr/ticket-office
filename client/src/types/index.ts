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
  treated_at?: string;
  fromApplication?: string;
  contributionType?: string;
  organisation?: string;
  fonction?: string;
  threads?: Thread[];
  extra?: Record<string, unknown>;
}

export interface Contribution extends BaseContribution {
  objectId?: string;
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
  collectionName: string;
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

export interface ExternalLinksProps {
  productionId: string;
  name: string;
  landingPages?: Record<string, string>;
}

export interface SelectWithNamesProps {
  productionId: string;
  idRef: string;
  coloredName: string;
  contributionId: string;
  authorData?: AuthorData;
  landingPage?: string;
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


export interface PaginationProps {
  page: number;
  maxPage: number;
  setPage: (page: number) => void;
}

export interface TopPaginationProps extends PaginationProps {
  meta?: { total?: number };
}

