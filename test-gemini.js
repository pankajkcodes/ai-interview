const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
  try {
    const env = fs.readFileSync('.env.local', 'utf8');
    const apiKey = env.match(/GEMINI_API_KEY=(.*)/)?.[1]?.trim();
    if (!apiKey) throw new Error("No API Key");

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try listing models to see what's available
    console.log("Listing available models...");
    // Note: listModels is not on genAI directly in some versions, it's on a client? 
    // Actually, in @google/generative-ai, we just try a few model names.

    const modelsToTry = ["gemini-3-flash-preview"];

    for (const modelName of modelsToTry) {
      console.log(`Trying model: ${modelName}...`);
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hi");
        const response = await result.response;
        console.log(`Success with ${modelName}! Response: ${response.text().substring(0, 20)}...`);
        break; // Stop if one works
      } catch (err) {
        console.error(`Failed ${modelName}: ${err.message}`);
      }
    }
  } catch (e) {
    console.error("Error:", e.message);
  }
}

run();
