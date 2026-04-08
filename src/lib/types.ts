export interface AIConfig {
  modelName: string;
  apiKey: string;
  service: "gemini" | "openai";
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  color: string;
  bgGradient: string;
}
