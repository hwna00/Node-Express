module.exports = (req, res, next) => {
  // console.log(res.locals.flash);
  console.log(res.session);
  // res.locals.flash = req.session.flash;
  // delete req.session.flash;
  next();
};
