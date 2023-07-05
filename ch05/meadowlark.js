const express = require("express");
const expressHandlebars = require("express-handlebars");
const app = express();
const port = process.env.PORT || 3000;
const handlers = require("./lib/handlers");

app.use(express.static(__dirname + "/public"));

app.engine(
  "handlebars",
  expressHandlebars({
    defaultLayout: "main",
  })
);

app.set("view engine", "handlebars");

app.get("/", handlers.home);

app.get("/about", (req, res) => handlers.about);

app.use(handlers.notFound);
app.use(handlers.serverError);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
