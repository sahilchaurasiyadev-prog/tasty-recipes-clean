const express = require("express");
const { connectDB } = require("../lib/db");
const recipeRoutes = require("../routes/recipeRoutes");

const app = express();
app.use(express.json());

// connect to MongoDB (no top-level await)
connectDB().catch(err => {
  console.error("MongoDB connection failed:", err);
});

// mount existing routes
app.use("/", recipeRoutes);

// export for Vercel
module.exports = app;
