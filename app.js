const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// Set EJS as the template engine
app.set("view engine", "ejs");

// Specify the 'views' directory
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public")); // Serve your static files

// Require automationRunner.js to run the automation script
const runAutomation = require("./automationRunner");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/run-automation", (req, res) => {
  runAutomation()
    .then((result) => {
      res.json({ result });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred during automation." });
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
