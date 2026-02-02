const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// tell Express to use EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// basic route
app.get("/", (req, res) => {
  res.render("index");
});

// start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
