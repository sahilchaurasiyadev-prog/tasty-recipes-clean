import express from "express";
import { connectDB } from "../lib/db.js";
import recipeRoutes from "../routes/recipeRoutes.js";

const app = express();
app.use(express.json());

// connect to MongoDB (serverless-safe)
await connectDB();

// mount existing Express routes
app.use("/", recipeRoutes);

// export as Vercel serverless function
export default app;
