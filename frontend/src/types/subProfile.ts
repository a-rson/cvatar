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
