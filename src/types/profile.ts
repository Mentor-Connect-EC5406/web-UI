// months are stored as YYYY-MM and years as YYYY so they sort as text

export interface ExperienceEntry {
  id: string;
  role: string;
  organization: string;
  startMonth: string;
  // null while the person still works there
  endMonth: string | null;
  description: string;
}

export interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  field: string;
  startYear: string;
  // null while still studying
  endYear: string | null;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issuedMonth: string;
  credentialUrl: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  skills: string[];
}

export type LanguageLevel = 'Basic' | 'Conversational' | 'Fluent' | 'Native';

export interface Language {
  name: string;
  level: LanguageLevel;
}

// empty string means the link is not set
export interface ProfileLinks {
  linkedin: string;
  github: string;
  website: string;
}

// sections both students and mentors keep on their profile
export interface ProfileExtras {
  headline: string;
  location: string;
  links: ProfileLinks;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certificates: Certificate[];
  projects: Project[];
  languages: Language[];
}

export type WorkType = 'Internship' | 'Full time' | 'Part time';
export type WorkArrangement = 'On site' | 'Hybrid' | 'Remote';

export interface WorkPreferences {
  openToOpportunities: boolean;
  desiredRoles: string[];
  workTypes: WorkType[];
  arrangements: WorkArrangement[];
}

// only students choose this, mentor profiles are always public once verified
export interface ProfileVisibility {
  isPublic: boolean;
  showEmail: boolean;
  showPhone: boolean;
}
