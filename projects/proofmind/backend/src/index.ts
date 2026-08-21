import app from "./app";
import { loadConfig } from "../../worker/src/config";

try {
  const config = loadConfig();
  const port = config.port || 3000;

  app.listen(port, () => {
    console.log(`[Backend] Server is running on port ${port}`);
  });
} catch (err: any) {
  console.error("[Backend Startup Error]", err.message);
  process.exit(1);
}
