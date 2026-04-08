import { AIConfig, Skill } from "./types";

const STORAGE_KEYS = {
  AI_CONFIG: "ai_interviewer_config",
  CUSTOM_SKILLS: "ai_interviewer_skills",
};

export function getAIConfig(): AIConfig | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(STORAGE_KEYS.AI_CONFIG);
  return data ? JSON.parse(data) : null;
}

export function saveAIConfig(config: AIConfig) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.AI_CONFIG, JSON.stringify(config));
}

export function getCustomSkills(): Skill[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_SKILLS);
  return data ? JSON.parse(data) : [];
}

export function saveCustomSkills(skills: Skill[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.CUSTOM_SKILLS, JSON.stringify(skills));
}

export function addCustomSkill(skill: Skill) {
  const skills = getCustomSkills();
  saveCustomSkills([...skills, skill]);
}

export function deleteCustomSkill(id: string) {
  const skills = getCustomSkills();
  saveCustomSkills(skills.filter(s => s.id !== id));
}
