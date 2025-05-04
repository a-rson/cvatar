export interface CandidateProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  maritalStatus?: string;
  education: string[];
  workExperience: {
    position: string;
    company: string;
    years: string;
  }[];
  techStack: {
    languages: string[];
    frameworks: string[];
    tools: string[];
  };
  spokenLanguages: string[];
  yearsOfExperience: number;
  softSkills: string[];
  avatarUrl?: string;
  documents?: string[];
}
