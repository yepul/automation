const express = require("express");
const app = express();
const path = require("path");
const { spawn } = require("child_process");

// Set up the view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files (CSS, JS, etc.) from a public directory
app.use(express.static(path.join(__dirname, "public")));

// Define routes
app.get("/", (req, res) => {
  res.render("index");
});

// Handle the "Start" button click
app.get("/start", (req, res) => {
  // Execute the external script using child_process.spawn
  const scriptPath = path.join(__dirname, "script.js");
  const startTime = new Date();

  const scriptProcess = spawn("node", [scriptPath]);

  scriptProcess.stdout.on("data", (data) => {
    // Calculate the time elapsed
    const currentTime = new Date();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);

    // Send the elapsed time to the client
    res.json({ elapsedTime: elapsedSeconds });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
