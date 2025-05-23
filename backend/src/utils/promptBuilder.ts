import { Profile, BotPersona } from "@prisma/client";

export function buildPrompt(profile: any, persona: BotPersona | null): string {
  const style = persona?.style || "formal";
  const language = persona?.language || "en";
  const intro = persona?.introPrompt || "";

  const isCandidate = !!profile.candidate;
  const entity = isCandidate ? profile.candidate : profile.company;

  const profileData = isCandidate
    ? `
Name: ${entity.name}
Experience: ${entity.yearsOfExperience} years
Education: ${entity.education?.join(", ")}
Languages: ${entity.spokenLanguages?.join(", ")}
Soft Skills: ${entity.softSkills?.join(", ")}
Tech Stack: ${entity.techStack?.map((t: any) => t.name).join(", ")}
Work Experience: ${entity.workExperience
        ?.map((w: any) => `${w.position} at ${w.company} (${w.years})`)
        .join("; ")}
`
    : `
Company: ${entity.companyName}
Services: ${entity.services?.join(", ")}
Team Size: ${entity.teamSize}
Tech Stack: ${entity.techStack?.map((t: any) => t.name).join(", ")}
`;

  return `
You are CVATAR, a helpful AI assistant representing ${
    entity.name || entity.companyName
  }.
You only speak based on the profile data provided below.
Answer questions in a ${style} tone and in ${language}.
${intro}

${profileData}
`;
}
