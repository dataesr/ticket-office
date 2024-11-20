export interface MetaData {
  total: number;
}

export interface FilteredContribution {
  id: string;
  name: string;
}

export interface ThreadResponse {
  team: string[];
  timestamp: string;
  responseMessage: string;
}

export interface Thread {
  responses: ThreadResponse[];
}

export interface Production {
  id: string;
  name: string;
  status: string;
  objectId: string;
  tag?: string;
  created_at: string;
  productions: Array<any>;
}

export interface Contribution_Production {
  id: string;
  status: string;
  created_at: string;
  productions: Production[];
  name: string;
  objectId: string;
  email?: string;
  comment?: string;
  description?: string;
  team?: string[];
  threads?: Thread[];
}

export interface ContributionPageProps {}

export interface ContributorProductionInfoProps {
  data: Contribution_Production;
  refetch: () => void;
  allTags: string[];
}

export interface ContributionProductionItemProps {
  data: Production;
  refetch: () => void;
  allTags: string[];
}

export interface ContributorRequestsProps {
  data: {
    objectId: string;
    id: string;
    name: string;
    productions: Production[];
  };
  coloredName: string;
}

export interface MessagePreviewProps {
  data: Contribution_Production;
  refetch: () => void;
  allTags: string[];
}

export interface ExcelExportButtonProps {
  refetch: () => void;
}

export interface ExternalLinksProps {
  productionId: string;
  name: string;
}

export interface SelectWithNamesProps {
  contributionId: string;
  productionId: string;
  idRef: string;
  coloredName: string;
}

export interface StaffProductionActionsProps {
  data: Contribution_Production;
  refetch: () => void;
}

export interface SelectOption {
  value: string;
  label: string;
  firstName: string;
  lastName: string;
  isColored: boolean;
}

export interface ContributionData {
  fullName: string;
  person_id: string;
  publi_id: string;
  contribution_id: string;
  first_name: string;
  last_name: string;
  export: boolean;
}

export interface ContributionDataResponse {
  data: Contribution_Production[];
  meta: MetaData;
  tags?: string[];
}

export interface ContributionDataHookResponse {
  data: ContributionDataResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}
