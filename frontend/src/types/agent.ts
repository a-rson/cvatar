export interface AgentData {
  name: string;
  language: string;
  style: string;
  tone: string;
  answerLength: string;
  introPrompt: string;
  disclaimerText: string;
  customInstructions: string;
  profileType: "candidate" | "company";
}
