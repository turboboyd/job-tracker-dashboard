import { Timestamp } from "firebase/firestore";

/**
 * Enums from schema
 */
export type ProcessStatus =
  | "SAVED"
  | "PLANNED"
  | "APPLIED"
  | "VIEWED"
  | "INTERVIEW_1"
  | "INTERVIEW_2"
  | "TEST_TASK"
  | "OFFER"
  | "REJECTED"
  | "NO_RESPONSE";

export type HistoryType =
  | "STATUS_CHANGE"
  | "FIELD_CHANGE"
  | "COMMENT"
  | "SYSTEM";
export type HistoryActor = "user" | "system";

export type RemotePreference = "REMOTE_ONLY" | "HYBRID_OK" | "ON_SITE_OK";
export type WorkMode = "REMOTE" | "HYBRID" | "ON_SITE";
export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT";

export type FeedbackType =
  | "HR_REPLY"
  | "TECH_FEEDBACK"
  | "SELF_NOTE"
  | "FOLLOW_UP"
  | "INTERVIEW_NOTE"
  | "REJECTION_REASON";

export type Sentiment = "positive" | "neutral" | "negative";

export type RejectionReasonCode =
  | "SKILLS_GAP"
  | "SENIORITY_MISMATCH"
  | "LANGUAGE_LEVEL"
  | "SALARY_MISMATCH"
  | "LOCATION_REMOTE"
  | "NO_RESPONSE"
  | "CULTURE_FIT"
  | "INTERNAL_CANDIDATE"
  | "OTHER";

export type UserSkill = {
  key: string;
  label: string;
  level: number; // 0..5
  years?: number;
  lastUsedAt?: Timestamp;
  evidence?: Array<{
    type: "PROJECT" | "COURSE" | "LINK";
    title: string;
    url?: string;
    from?: string;
  }>;
};

export type UserDoc = {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  profile: {
    fullName?: string;
    location?: { country?: string; city?: string; timezone?: string };
    workAuthorization?: { hasWorkPermit?: boolean; permitType?: string };
    languages?: { de?: string; en?: string };
    salaryExpectation?: { currency?: string; min?: number; max?: number };
    roleTargets?: string[];
    remotePreference?: RemotePreference;
  };
  skills: UserSkill[];
  matchSettings: {
    weights: {
      skills: number;
      experience: number;
      language: number;
      location: number;
      domain: number;
      salary: number;
    };
    hardFilters: {
      minGermanLevel?: string;
      allowOnSite: boolean;
      allowHybrid: boolean;
      allowRemote: boolean;
    };
    skillSynonymsVersion: number;
  };
};

export type MatchingBreakdown = {
  skills: number;
  experience: number;
  language: number;
  location: number;
  domain: number;
  salary: number;
};

export type MatchingDecision = "match" | "maybe" | "skip";

export type MatchingBlock = {
  decision: MatchingDecision;
  score: number; // 0..100
  breakdown: MatchingBreakdown;
  hardFilterFlags: Record<string, boolean>;
  matchedSkillsTop: string[];
  gapsTop: string[];
  computedAt: Timestamp;
  confidence: number; // 0..1
};

export type PriorityBlock = {
  score: number; // 0..100
  reasons: string[];
  computedAt: Timestamp;
};

export type ApplicationDoc = {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  archived: boolean;

  job: {
    companyName: string;
    companyId?: string;
    roleTitle: string;
    locationText?: string;
    vacancyUrl?: string;
    source?: string;
    postedAt?: Timestamp;
    salary?: { currency?: string; min?: number; max?: number };
    employmentType?: EmploymentType;
    workMode?: WorkMode;
  };

  process: {
    status: ProcessStatus;
    lastStatusChangeAt: Timestamp;
    nextActionAt?: Timestamp;
    nextActionText?: string;
    contactAttempts: number;
    lastContactAt?: Timestamp;
    lastFollowUpAt?: Timestamp;
    followUpLevel: number; // 0|1|2
    needsFollowUp: boolean;
    followUpDueAt?: Timestamp;
    needsReapplySuggestion: boolean;
    reapplyEligibleAt?: Timestamp;
    reapplyReason?: string;
  };

  notes?: {
    currentNote?: string;
    tags?: string[];
  };

  vacancy?: {
    rawDescription?: string;
    roleFingerprint?: string;
  };

  matching?: MatchingBlock;
  priority?: PriorityBlock;
  cvLinkage?: { cvVersionId?: string; profileVersionId?: string };
};

export type HistoryEventDoc = {
  createdAt?: Timestamp; // filled on commit
  actor: HistoryActor;
  type: HistoryType;

  // STATUS_CHANGE
  fromStatus?: ProcessStatus;
  toStatus?: ProcessStatus;

  // FIELD_CHANGE
  fieldPath?: string;
  oldValue?: any;
  newValue?: any;

  // COMMENT
  comment?: string;
  feedbackType?: FeedbackType;
  sentiment?: Sentiment;
  rejectionReasonCode?: RejectionReasonCode;
};

export type DotPatch = Record<string, any>;
