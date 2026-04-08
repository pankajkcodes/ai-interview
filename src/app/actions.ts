"use server";

import { getGeminiResponse, getFinalEvaluation } from "@/lib/gemini";

export async function handleInterviewStep(role: string, context: { questionIndex: number, previousQA: { question: string, answer: string }[] }) {
  try {
    const nextContent = await getGeminiResponse(role, context);
    return { success: true, content: nextContent };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { success: false, error: "AI failed to respond. Please try again." };
  }
}

export async function handleInterviewFinisher(role: string, previousQA: { question: string, answer: string }[]) {
  try {
    const evaluation = await getFinalEvaluation(role, previousQA);
    return { success: true, evaluation };
  } catch (error) {
    console.error("Evaluation Error:", error);
    return { success: false, error: "Failed to generate evaluation." };
  }
}
