const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { HumanMessage } = require('@langchain/core/messages');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0.3,
  apiKey: process.env.apikey
});

app.get("/", (req, res) => {
  res.json([{ message: "Finance AI API is running." }]);
});

app.post('/build', (req, res) => {
  const assetName = req.body.assetName; 

const prompt =
  "You are an experienced financial analyst. Analyze the asset: \"" + assetName + "\" " +
  "— it may be a company, stock, or cryptocurrency. Use only verified and public data.\n\n" +

  "Give a short, structured financial report covering:\n" +
  "1. **Overview** – Category, sector, brief description.\n" +
  "2. **Past Performance** – Key price trends (1-year, 5-year, etc.) with % change.\n" +
  "3. **Current Status** – Current price, market cap, and major updates.\n" +
  "4. **Future Outlook** – Short summary of likely direction and risks.\n" +
  "5. **Recommendation** – Buy/Hold/Sell with short-term and long-term view.\n" +
  "6. **Confidence Level** – % confidence in your call.\n\n" +

  "End with one clear line: 'Final Conclusion: You should buy it at around $90. The chances of profit are 90%.'\n\n" +

  "Keep it brief, professional, and numeric wherever possible (price, %, ratio). Avoid speculation.";



  const messages = [new HumanMessage({ content: prompt })];

  model.invoke(messages)
    .then((response) => {
      const formattedResponse = (response.content || "").trim();
      res.json({ analysis: formattedResponse });
    })
    .catch((error) => {
      console.error("AI Model Error:", error.message);
      res.status(500).json({
        error: "Failed to generate financial analysis",
        details: error.message
      });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
