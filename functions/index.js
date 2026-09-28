const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const TARGET_API_URL = process.env.AI_API_URL || "https://imgxh.eu.org/v1/chat/completions";
const SECRET_API_KEY = process.env.AI_API_KEY || "sk-agw-c6Xrt2h0y5mByXobFPPsNygbF9qWhL2uYL1K";

exports.chatCompletions = onRequest({ cors: true, maxInstances: 10 }, async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { model, messages, temperature } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid payload: messages array required." });
  }

  try {
    const upstreamRes = await fetch(TARGET_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SECRET_API_KEY}`
      },
      body: JSON.stringify({
        model: model || "imgxh/server-6",
        messages,
        temperature: temperature ?? 0.7
      })
    });

    if (!upstreamRes.ok) {
      const errText = await upstreamRes.text();
      logger.error("Upstream error", upstreamRes.status, errText);
      return res.status(upstreamRes.status).send(errText);
    }

    const data = await upstreamRes.json();
    return res.status(200).json(data);
  } catch (err) {
    logger.error("Chat proxy error", err);
    return res.status(500).json({ error: "Internal chat proxy failure" });
  }
});
