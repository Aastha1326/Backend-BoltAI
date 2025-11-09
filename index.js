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
   "You are a quantitative financial analyst specializing in algorithmic trading. " +
"Analyze the asset: \"" + assetName + "\" — it can be a stock, index, forex pair, or cryptocurrency. " +
"Use only verified, publicly available market data.\n\n" +

"Generate a structured, numeric, and model-friendly trading report including:\n\n" +

"1. **Asset Overview** – Asset type, sector, average volatility (%), and liquidity status (high/medium/low).\n\n" +

"2. **Historical Price Behavior** – \n" +
"   - 1M, 6M, 1Y, and 5Y price changes (%).\n" +
"   - 52-week high/low levels.\n" +
"   - Average daily volatility (%).\n" +
"   - Correlation with benchmark index (if applicable).\n\n" +

"3. **Technical Indicators (Current Values)** – \n" +
"   - RSI, MACD, Bollinger Bands (upper/lower bands), 50D & 200D MA, EMA crossover signals.\n" +
"   - Key support/resistance levels.\n" +
"   - Volume trend (increasing/decreasing vs 30D average).\n\n" +

"4. **Momentum & Signal Analysis** – \n" +
"   - Identify bullish/bearish patterns.\n" +
"   - Trend strength score (0–100).\n" +
"   - Signal confidence (Buy / Sell / Neutral) based on multi-indicator agreement.\n\n" +

"5. **Trade Setup Recommendation** – \n" +
"   - Suggested Entry Price, Target Price, Stop-Loss.\n" +
"   - Expected Risk–Reward Ratio.\n" +
"   - Recommended position type (Long / Short / Wait).\n\n" +

"6. **Confidence Metrics** – \n" +
"   - Overall confidence level (%) derived from indicator alignment and historical pattern reliability.\n\n" +

"**Final Conclusion:** Summarize your trading stance (e.g., “Bullish bias, high probability of upward continuation in short term”) in one precise, quantitative line.";



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


