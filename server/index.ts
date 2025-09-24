import { createApp } from "./createApp.js";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  try {
    const app = await createApp();

    const PORT = process.env.PORT || 3000;
    
    app.listen(PORT, () => {
      console.log(`Server ready at http://localhost:${PORT}`);
      console.log(`REST API: http://localhost:${PORT}/api`);
      console.log(`GraphQL API: http://localhost:${PORT}/graphql`);
      
      if (process.env.NODE_ENV === "production") {
        console.log(`Frontend: http://localhost:${PORT}`);
      } else {
        console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      }
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});

startServer();
