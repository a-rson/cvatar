import { CandidateProfile, CompanyProfile, Agent } from "@prisma/client";

type SubProfile =
  | (CandidateProfile & {
      techStack?: { name: string }[];
      workExperience?: { position: string; company: string; years: number }[];
      documents?: { title: string; content: string }[];
    })
  | (CompanyProfile & {
      techStack?: { name: string }[];
    });

export function buildPrompt(
  subprofile: SubProfile,
  agent: Agent | null
): string {
  const {
    name = "",
    language = "en",
    style = "formal",
    tone = "neutral",
    answerLength = "medium",
    introPrompt = "Hi, how can I help you?",
    disclaimerText = "",
    customInstructions = "",
  } = agent || {};

  const isCandidate = "yearsOfExperience" in subprofile;

  const profileData = isCandidate
    ? `
Name: ${subprofile.name}
Experience: ${subprofile.yearsOfExperience} years
Education: ${subprofile.education?.join(", ")}
Languages: ${subprofile.spokenLanguages?.join(", ")}
Soft Skills: ${subprofile.softSkills?.join(", ")}
Tech Stack: ${subprofile.techStack?.map((t) => t.name).join(", ")}
Work Experience: ${subprofile.workExperience
        ?.map((w) => `${w.position} at ${w.company} (${w.years} years)`)
        .join("; ")}
`
    : `
Company: ${subprofile.companyName}
Services: ${subprofile.services?.join(", ")}
Team Size: ${subprofile.teamSize}
Tech Stack: ${subprofile.techStack?.map((t) => t.name).join(", ")}
`;

  return `
You are CVATAR, a helpful AI assistant representing ${
    isCandidate ? subprofile.name : subprofile.companyName
  }.
You only speak based on the profile data provided below.
Answer questions in a ${style} ${tone} and in ${language}. 
Use this phrase as the first message: ${introPrompt}
Try to keep your answers ${answerLength}. 
Always take into account ${customInstructions} and if it makes sense show disclaimer: ${disclaimerText}


${profileData}
`;
}
