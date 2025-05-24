import express from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Basic middleware only
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    console.log(`${req.method} ${req.path}`);
  }
  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('Error:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = process.env.PORT || 5000;
  server.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`serving on port ${port}`);
  });
})();