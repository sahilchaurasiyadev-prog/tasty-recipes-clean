const express = require("express");
const { connectDB } = require("../lib/db");
const recipeRoutes = require("../routes/recipeRoutes");

const app = express();
app.use(express.json());

let isConnected = false;

async function initDB() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
}

// mount routes
app.use("/", recipeRoutes);

// Vercel-compatible handler
module.exports = async (req, res) => {
  await initDB();
  return app(req, res);
};
