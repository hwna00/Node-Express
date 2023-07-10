const express = require("express");
const expressHandlebars = require("express-handlebars");
const multiparty = require("multiparty");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

const handlers = require("./lib/handlers");
const weatherMiddleware = require("./lib/middleware/weather");
const credentials = require("../.credentials.development");
const flashMiddleware = require("./lib/middleware/flash");

const app = express();
const port = process.env.PORT || 3000;

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

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(weatherMiddleware);
app.use(flashMiddleware);
app.use(cookieParser(credentials.cookieSecret));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
  })
);

app.get("/", handlers.home);
app.get("/about", (req, res) => handlers.about(req, res));
app.get("/section-test", handlers.sectionTest);

//* handlers for browser-based form submission
app.get("/newsletter-signup", handlers.newsletterSignup);
app.post("/newsletter-signup/process", handlers.newsletterSignupProcess);
app.get("/newsletter-signup/thank-you", handlers.newsletterSignupThankYou);
app.get("/newsletter-archive", handlers.newsletterSignupThankYou);

//* handlers for fetch/JSON form submission
app.get("/newsletter", handlers.newsletter);
app.post("/api/newsletter-signup", handlers.api.newsletterSignup);

//* vacation photo contest
app.get("/contest/vacation-photo", handlers.vacationPhotoContest);
app.get("/contest/vacation-photo-ajax", handlers.vacationPhotoContestAjax);
app.get(
  "/contest/vacation-photo-thank-you",
  handlers.vacationPhotoContestProcessThankYou
);
app.post("/contest/vacation-photo/:year/:month", (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    handlers.vacationPhotoContestProcess(req, res, fields, files);
  });
});
app.post("/api/vacation-photo-contest/:year/:month", (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    if (err)
      return handlers.api.vacationPhotoContestError(req, res, err.message);
    handlers.api.vacationPhotoContest(req, res, fields, files);
  });
});

app.use(handlers.notFound);
app.use(handlers.serverError);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`server started on port ${port}`);
  });
} else {
  module.exports = app;
}
