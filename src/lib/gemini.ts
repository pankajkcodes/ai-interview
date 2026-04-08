import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * RE-COMPILATION SYNC: Updated to gemini-3-flash-preview for June 2026.
 * ID: cache_bust_v2
 */

export const INTERVIEW_ROLES = [
  { 
    id: "flutter", 
    name: "Flutter Developer", 
    description: "Mobile app developer with expertise in Flutter and Dart.",
    color: "#027DFD",
    bgGradient: "linear-gradient(135deg, rgba(2, 125, 253, 0.2) 0%, rgba(0, 255, 255, 0.2) 100%)"
  },
  { 
    id: "node", 
    name: "Node.js Backend", 
    description: "Backend engineer focused on scalable microservices.",
    color: "#339933",
    bgGradient: "linear-gradient(135deg, rgba(51, 153, 51, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)"
  },
  { 
    id: "react", 
    name: "React Frontend", 
    description: "Frontend expert specializing in performance and UI/UX.",
    color: "#61DAFB",
    bgGradient: "linear-gradient(135deg, rgba(97, 218, 251, 0.2) 0%, rgba(79, 70, 229, 0.2) 100%)"
  },
  { 
    id: "fullstack", 
    name: "Fullstack Engineer", 
    description: "Versatile developer handling both frontend and backend.",
    color: "#F7DF1E",
    bgGradient: "linear-gradient(135deg, rgba(247, 223, 30, 0.2) 0%, rgba(249, 115, 22, 0.2) 100%)"
  },
];

function getChatModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
}

export async function getGeminiResponse(role: string, context: { questionIndex: number, previousQA: { question: string, answer: string }[] }) {
  const model = getChatModel();

  const systemInstructions = `You are a professional technical interviewer for the position of ${role}.
  Your goal is to conduct a high-quality, 5-question interview.
  
  RULES:
  1. Ask exactly ONE question at a time.
  2. If it is the first question, introduce yourself briefly and start.
  3. If it is not the first question, briefly acknowledge the previous answer (be supportive but objective) and then ask the next question.
  4. After 5 questions, your final message MUST be exactly: "INTERVIEW_COMPLETE". No other text.
  
  CURRENT STATE:
  - Role: ${role}
  - Question Number: ${context.questionIndex + 1} of 5
  - Previous Questions and Answers: ${JSON.stringify(context.previousQA)}
  
  Tone: Professional, encouraging, and focused on technical depth.`;

  const result = await model.generateContent(systemInstructions);
  const response = await result.response;
  return response.text();
}

/**
 * Final evaluation prompt to get score and feedback
 */
export async function getFinalEvaluation(role: string, previousQA: { question: string, answer: string }[]) {
  const model = getChatModel();

  const evaluationPrompt = `As a lead technical interviewer for ${role}, evaluate the candidate's overall performance based on the following interview transcript:
  
  ${JSON.stringify(previousQA, null, 2)}
  
  Provide your evaluation in a JSON format:
  {
    "totalScore": number (0-100),
    "summary": string,
    "strengths": string[],
    "weaknesses": string[],
    "detailedFeedback": [
       { "question": string, "answer": string, "score": number (0-10), "comment": string }
    ]
  }

  Only return the JSON object, no other text or formatting blocks.`;

  const result = await model.generateContent(evaluationPrompt);
  const response = await result.response;
  const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(text);
}
