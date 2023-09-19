import { IPageable, ISort } from './toggle';

export interface IVariation {
  id?: string;
  name?: string;
  value?: string;
  description?: string;
  key?: string;
  text?: string;
  inputValue?: number;
  percentage?: string;
}

export interface IOption {
  key: string;
  text: string;
  value: string;
}

export interface ICondition {
  id?: string;
  type: string;
  subject?: string;
  predicate: string;
  objects?: string[];
  datetime?: string;
  timezone?: string;
  leftPredicate?: string;
  rightPredicate?: string;
  rightObjects?: string[];
}

export interface IServe {
  split?: number[];
  select?: number;
}

export interface IRule {
  id?: string;
  name: string;
  conditions: ICondition[];
  serve?: IServe;
  active?: boolean;
}

export interface IToggleInfo {
  name: string;
  key: string;
  tags: string[];
  desc: string;
  createdBy: string;
  createdTime: string;
  disabledServe: number;
  modifiedBy: string;
  modifiedTime: string;
  returnType: string;
  clientAvailability: boolean;
  variations: IVariation[];
  archived: boolean;
  permanent: boolean;
  useDays?: number;
  disabled?: boolean;
}

export interface ITarget {
  rules: IRule[];
  variations: IVariation[];
  defaultServe: IServe;
  disabledServe: IServe;
  prerequisites?: IPrerequisite[];
}

export interface IContent {
  version: number;
  disabled: boolean;
  comment: string;
  content: ITarget;
  modifiedBy: string;
  modifiedTime: string;
  enableApproval: boolean;
  status: string;
  reviewers: string[];
  submitBy?: string;
  approvalBy?: string;
  approvalComment?: string;
  locked?: boolean;
  lockedTime?: string;
  publishTime?: string;
  trackAccessEvents: boolean;
  allowEnableTrackAccessEvents: boolean;
}

export interface IModifyInfo {
  modifiedBy?: string;
  modifiedTime?: string;
}

export interface IValues {
  count: number;
  value: string;
  deleted: boolean;
}

export interface ITraffic {
  name: string;
  values: IValues[];
  lastChangeVersion?: number;
}

export interface ITrafficContent {
  isAccess: boolean;
  traffic: ITraffic[],
  summary: IValues[]
}

export interface ITrafficParams {
  lastHours: string;
  trafficType: string;
}

export interface IVersion {
  projectKey: string,
  comment: string,
  version: number,
  createdTime: string;
  createdBy: string;
  disabled: boolean;
  approvalComment?: string;
  approvalBy?: string;
  approvalStatus?: string;
  approvalTime?: string;
}

export interface ITargetingVersion extends IVersion {
  approvalBy: string;
  approvalStatus: string;
  approvalTime: string;
  approvalComment?: string;
  content: ITarget;
  environmentKey: string,
}

export interface ITargetingVersions {
  totalElements: number;
  totalPages: number;
  sort: ISort;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: IPageable;
  size: number;
  content: ITargetingVersion[];
  number: number;
  empty: boolean;
}

export interface ITargetingVersionsByVersion {
  total: number;
  versions: ITargetingVersion[]
}

export interface IDictionary {
  key: string;
  createdTime: string;
  value: string;
  updatedTime: string;
}

export interface IDictionary {
  key: string;
  createdTime: string;
  value: string;
  updatedTime: string;
}

export interface IApprovalInfo {
  enableApproval: boolean;
  status: string;
  reviewers: string[];
  submitBy?: string;
  approvalBy?: string;
  approvalComment?: string;
  locked?: boolean;
  lockedTime?: string;
  publishTime?: string;
}

export interface ITargeting {
  disabled: boolean;
  content: ITarget;
}

export interface ITargetingParams {
  disabled: boolean;
  comment?: string;
  content: ITarget;
  reviewers?: string[];
  trackAccessEvents?: boolean;
  baseVersion?: number;
}

export interface ITargetingDiff {
  currentDisabled: boolean;
  oldDisabled: boolean;
  currentContent: ITarget;
  oldContent: ITarget;
}

export interface IPrerequisite {
  id?: string;
  key: string;
  value: string;
  type: string;
}
