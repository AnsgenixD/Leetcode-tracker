// test-server.js  →  node test-server.js
import express from "express";
import cors from "cors";

const app = express();

// CORS is required — the request comes from moz-extension://<uuid>
app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/api/problem", (req, res) => {
  console.log("✅ Received problem:", req.body);
  res.json({ ok: true });
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));