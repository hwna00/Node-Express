module.exports = (req, res, next) => {
  const { cart } = req.session;
  if (!cart) return next();
  if (cart.items.some((item) => item.guests > item.product.maxGuests)) {
    cart.errors.push(
      "One or more of your selected tours " +
        "cannot accommodate the number of guests you " +
        "have selected."
    );
  }
  next();
};
