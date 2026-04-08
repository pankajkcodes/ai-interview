import { AIConfig } from "./types";

export async function getOpenAIResponse(
  role: string, 
  context: { questionIndex: number, previousQA: { question: string, answer: string }[] },
  config?: AIConfig
) {
  const apiKey = config?.apiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API Key is missing. Please provide it in settings.");
  }
  
  const modelName = config?.modelName || "gpt-4o";

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

  const messages = [
    { role: "system", content: systemInstructions },
    { role: "user", content: "Proceed with the current state." }
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelName,
      messages: messages,
      temperature: 0.7,
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Failed to fetch response from OpenAI.");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function getOpenAIEvaluation(
  role: string, 
  previousQA: { question: string, answer: string }[], 
  config?: AIConfig
) {
  const apiKey = config?.apiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API Key is missing. Please provide it in settings.");
  }
  
  const modelName = config?.modelName || "gpt-4o";

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

  const messages = [
    { role: "developer", content: "You are a helpful assistant." },
    { role: "user", content: evaluationPrompt }
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelName,
      messages: messages,
      temperature: 0.7,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Failed to fetch evaluation from OpenAI.");
  }

  const data = await response.json();
  const text = data.choices[0].message.content;
  
  try {
    return JSON.parse(text);
  } catch (e) {
    // Fallback if structured json parse fails
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  }
}
