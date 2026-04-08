"use server";

import { getGeminiResponse, getFinalEvaluation as getGeminiFinalEvaluation } from "@/lib/gemini";
import { getOpenAIResponse, getOpenAIEvaluation } from "@/lib/openai";
import { AIConfig } from "@/lib/types";

export async function handleInterviewStep(
  role: string, 
  context: { questionIndex: number, previousQA: { question: string, answer: string }[] },
  config?: AIConfig
) {
  try {
    let nextContent;
    if (config?.service === "openai") {
      nextContent = await getOpenAIResponse(role, context, config);
    } else {
      nextContent = await getGeminiResponse(role, context, config);
    }
    return { success: true, content: nextContent };
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return { success: false, error: error?.message || "AI failed to respond. Please try again." };
  }
}

export async function handleInterviewFinisher(
  role: string, 
  previousQA: { question: string, answer: string }[],
  config?: AIConfig
) {
  try {
    let evaluation;
    if (config?.service === "openai") {
      evaluation = await getOpenAIEvaluation(role, previousQA, config);
    } else {
      evaluation = await getGeminiFinalEvaluation(role, previousQA, config);
    }
    return { success: true, evaluation };
  } catch (error: any) {
    console.error("Evaluation Error:", error);
    return { success: false, error: error?.message || "Failed to generate evaluation." };
  }
}
