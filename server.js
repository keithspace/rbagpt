const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("google-generative-ai");
require("dotenv").config();
const cors = require("cors"); // Add cors middleware

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.text());

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    safetySettings: {
      harmLimit: {
        category: HarmCategory.NONE,
        threshold: HarmBlockThreshold.LOW,
      },
    },
  });

  app.post("/ask", async (req, res) => {
    const inputText = req.body;
    const result = await chatSession.sendMessage(inputText);
    res.send(result.response.text());
  });

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

run();
