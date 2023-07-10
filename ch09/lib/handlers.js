const fortune = require("./fortune");
const VALID_EMAIL_REGEX = new RegExp(
  "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@" +
    "[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?" +
    "(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$"
);

class NewsletterSignup {
  constructor({ name, email }) {
    (this.name = name), (this.email = email);
  }
  async save() {}
}

exports.home = (req, res) => {
  res.cookie("monster", "nom nom");
  res.cookie("signed_monster", "nom nom", { signed: true });
  res.render("home");
};

exports.about = (req, res) =>
  res.render("about", { fortune: fortune.getFortune() });

exports.sectionTest = (req, res) => {
  res.render("section-test");
};

exports.newsletterSignup = (req, res) => {
  res.render("newsletter-signup", { csrf: "CSRF token goes here" });
};

exports.newsletterSignupProcess = (req, res) => {
  const name = req.body.name || "";
  const email = req.body.email || "";
  if (!VALID_EMAIL_REGEX.test(email)) {
    req.session.flash = {
      type: "danger",
      intro: "Validation error!",
      message: "The email address you entered was not valid",
    };
    return res.redirect(303, "/newsletter-signup");
  }
  new NewsletterSignup({ name, email })
    .save()
    .then(() => {
      req.session.flash = {
        type: "success",
        intro: "Thank you!",
        message: "You have now been signed up for the newsletter",
      };
      return res.redirect(303, "/newsletter-archive");
    })
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      req.session.flash = {
        type: "danger",
        intro: "Database error!",
        message: "There was a database error; please try again later.",
      };
      return res.redirect(303, "/newsletter-archive");
    });
};

exports.newsletterSignupThankYou = (req, res) =>
  res.render("newsletter-signup-thank-you");

exports.newsletter = (req, res) => {
  res.render("newsletter", { csrf: "CSRF token goes here" });
};
exports.api = {
  newsletterSignup: (req, res) => {
    console.log("CSRF token (from hidden form field): " + req.body._csrf);
    console.log("Name (from visible form field): " + req.body.name);
    console.log("Email (from visible form field): " + req.body.email);
    res.send({ result: "success" });
  },
};

exports.vacationPhotoContest = (req, res) => {
  const now = new Date();
  res.render("contest/vacation-photo", {
    year: now.getFullYear(),
    month: now.getMonth(),
  });
};
exports.vacationPhotoContestAjax = (req, res) => {
  const now = new Date();
  res.render("contest/vacation-photo-ajax", {
    year: now.getFullYear(),
    month: now.getMonth(),
  });
};
exports.vacationPhotoContestProcess = (req, res, fields, files) => {
  console.log("field data: ", fields);
  console.log("files: ", files);
  res.redirect(303, "/contest/vacation-photo-thank-you");
};
exports.vacationPhotoContestProcessThankYou = (req, res) => {
  res.render("contest/vacation-photo-thank-you");
};
exports.api.vacationPhotoContest = (req, res, fields, files) => {
  console.log("field data: ", fields);
  console.log("files: ", files);
  res.send({ result: "success" });
};

exports.notFound = (req, res) => res.render("404");

// eslint-disable-next-line no-unused-vars
exports.serverError = (err, req, res, next) => res.render("500");
