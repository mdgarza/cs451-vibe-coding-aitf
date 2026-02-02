const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// middleware to read form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


// tell Express to use EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --------------------
// In-memory data
// --------------------
const internalPosts = []; 
// each post: { id, title, description, createdAt, comments[] }

const externalLinks = []; // unchanged

// home page
app.get("/", (req, res) => {
  res.render("index");
});

// --------------------
// Internal posts
// --------------------
app.get("/internal", (req, res) => {
  res.render("internal", { posts: internalPosts });
});

app.post("/internal", (req, res) => {
  const title = (req.body.title || "").trim();
  const description = (req.body.description || "").trim();

  if (!title || !description) {
    return res.status(400).send("Please provide BOTH a title and description.");
  }

  internalPosts.unshift({
    id: Date.now(), // simple unique id
    title,
    description,
    createdAt: new Date().toLocaleString(),
    comments: [],
  });

  res.redirect("/internal");
});

// --------------------
// Add comment to internal post
// --------------------
app.post("/internal/:id/comment", (req, res) => {
  const postId = Number(req.params.id);
  const text = (req.body.text || "").trim();

  if (!text) {
    return res.redirect("/internal");
  }

  const post = internalPosts.find((p) => p.id === postId);
  if (post) {
    post.comments.push({
      text,
      createdAt: new Date().toLocaleString(),
    });
  }

  res.redirect("/internal");
});

// --------------------
// External links (unchanged)
// --------------------
app.get("/external", (req, res) => {
  res.render("external", { links: externalLinks });
});

app.post("/external", (req, res) => {
  const title = (req.body.title || "").trim();
  const url = (req.body.url || "").trim();
  const note = (req.body.note || "").trim();

  if (!title || !url) {
    return res.status(400).send("Please provide BOTH a title and a URL.");
  }

  const normalizedUrl =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;

  externalLinks.unshift({
    title,
    url: normalizedUrl,
    note,
    createdAt: new Date().toLocaleString(),
  });

  res.redirect("/external");
});

// start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
