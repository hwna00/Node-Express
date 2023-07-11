const fortune = require("./fortune");
const VALID_EMAIL_REGEX = new RegExp(
  "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@" +
    "[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?" +
    "(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$"
);
const products = [
  {
    id: "hPc8YUbFuZM9edw4DaxwHk",
    name: "Rock Climbing Expedition in Bend",
    price: 239.95,
    requiresWaiver: true,
  },
  {
    id: "eyryDtCCu9UUcqe9XgjbRk",
    name: "Walking Tour of Portland",
    price: 89.95,
  },
  {
    id: "6oC1Akf6EbcxWZXHQYNFwx",
    name: "Manzanita Surf Expedition",
    price: 159.95,
    maxGuests: 4,
  },
  {
    id: "w6wTWMx39zcBiTdpM9w5J7",
    name: "Wine Tasting in the Willamette Valley",
    price: 229.95,
  },
];

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

exports.cart = (req, res) => {
  // eslint-disable-next-line no-unused-vars
  console.log(req.session);
  const cart = req.session.cart || { items: [] };
  const context = { products, cart };
  console.log("cart");
  res.render("cart", context);
};
exports.cartProcess = (req, res) => {
  if (!req.session.cart) req.session.cart = { items: [] };

  const { cart } = req.session;
  Object.keys(req.body).forEach((key) => {
    if (!key.startsWith("guests-")) return;
    const productId = key.split("-")[1];
    const productsById = products.reduce(
      (byId, p) => Object.assign(byId, { [p.id]: p }),
      {}
    );
    const product = productsById[productId];
    const guests = Number(req.body[key]);

    if (guests === 0) return;

    if (!cart.items.some((item) => item.product.id === productId)) {
      cart.items.push({ product, guests: 0 });
    }
    const idx = cart.items.findIndex((item) => item.product.id === productId);
    const item = cart.items[idx];
    item.guests += guests;
    if (item.guests < 0) item.guests = 0;
    if (item.guests === 0) cart.items.splice(idx, 1);
  });

  console.log(req.session);
  res.redirect("/cart");
};

exports.notFound = (req, res) => res.render("404");

// eslint-disable-next-line no-unused-vars
exports.serverError = (err, req, res, next) => res.render("500");
