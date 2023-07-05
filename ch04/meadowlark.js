const express = require("express");
const expressHandlebars = require("express-handlebars");
const app = express();
const port = process.env.PORT || 3000;
const fortune = require("./lib/fortune");

app.use(express.static(__dirname + "/public"));

app.engine(
  "handlebars",
  expressHandlebars({
    defaultLayout: "main",
  })
);

app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
  res.render("about", { fortune: fortune.getFortune() });
});

app.use((req, res) => {
  res.status(404);
  res.render("404");
});

app.use((req, res) => {
  res.status(500);
  res.render("500");
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
