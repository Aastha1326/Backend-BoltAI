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
  "You are an expert quantitative trader and financial analyst. Analyze the asset: \"" + assetName +
  "\" — it may be a stock, index, or cryptocurrency.\n\n" +

  "Use verified, factual, and public financial + technical data (no assumptions). Focus on algorithmic trading signals.\n" +
  "Avoid long text — output must be compact, numeric, and suitable for a trading bot summary.\n\n" +

  "### ⚙️ Output Format (Under 10 lines):\n" +
  "1. **Core Data** – Current Price, 1D / 1W / 1M % change, Volatility %, Beta, Volume trend (↑/↓), Market Cap.\n" +
  "2. **Technical Indicators** – RSI, MACD Signal (Bullish/Bearish/Neutral), 20/50/200 MA trend, Support/Resistance levels.\n" +
  "3. **Momentum Snapshot** – Show ASCII bars for momentum/trend (e.g., ▓▓▓░░ or ▲▲▼▲).\n" +
  "4. **Algo Signal (Short-Term)** – Numeric target range (±%), Stop-Loss, and Signal: Buy / Sell / Hold (🟢🔴🟡).\n" +
  "5. **Algo Signal (Long-Term)** – 3–6M and 1–3Y CAGR %, risk (1–10), and trend visual.\n" +
  "6. **Final Verdict** – One concise line:\n" +
  "   'Short: Buy 🟢 | Long: Buy 🟢 | Target: +18% | Stop-Loss: -5% | Confidence: 91%.'\n\n" +

  "Keep output machine-readable — no paragraphs. Show data, indicators, and signal clarity for algorithmic decision-making.";


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

