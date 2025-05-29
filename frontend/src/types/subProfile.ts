export type CandidateProfileData = {
  name: string;
  firstName: string;
  lastName: string;
  description: string;
  maritalStatus: string;
  education: string[];
  spokenLanguages: string[];
  softSkills: string[];
  yearsOfExperience: string;
  avatar: File | null;
  avatarUrl?: string;
  documents?: any[];
  profileType?: "Candidate";
};

export type CompanyProfileData = {
  name: string;
  companyName: string;
  description: string;
  logoUrl: string;
  services: string; // comma-separated
  languages: string; // comma-separated
  frameworks: string; // comma-separated
  tools: string; // comma-separated
  teamSize: string;
  contactEmail: string;
  contactPhone: string;
  documents?: any[];
  profileType?: "Company";
};
