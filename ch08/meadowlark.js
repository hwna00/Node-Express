const express = require("express");
const expressHandlebars = require("express-handlebars");
const handlers = require("./lib/handlers");
const weatherMiddleware = require("./lib/middleware/weather");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));
app.use(weatherMiddleware);

app.engine(
  "handlebars",
  expressHandlebars({
    defaultLayout: "main",
    helpers: {
      section: function (name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
      },
    },
  })
);

app.set("view engine", "handlebars");

app.get("/", handlers.home);

app.get("/about", (req, res) => handlers.about(req, res));

app.get("/section-test", handlers.sectionTest);

app.use(handlers.notFound);
app.use(handlers.serverError);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`server started on port ${port}`);
  });
} else {
  module.exports = app;
}
