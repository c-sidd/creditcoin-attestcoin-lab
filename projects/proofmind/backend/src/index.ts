import express from "express";
import cors from "cors";
import router from "./routes";
import { loadConfig } from "./config";

const app = express();
const config = loadConfig();

app.use(cors({
  origin: config.allowedOrigins,
  methods: ["GET", "POST", "OPTIONS"]
}));
app.use(express.json());

// Mount API router
app.use("/api/v1", router);

// Mount top-level health redirect
app.get("/health", (req, res) => {
  res.redirect("/api/v1/health");
});

if (require.main === module) {
  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`ProofMind Backend listening on port ${PORT}`);
  });
}

export default app;
