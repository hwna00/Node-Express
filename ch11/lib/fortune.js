const fortuneCookies = [
  "Conquer your fears or they will conquer you.",
  "Rivers needs springs.",
  "Do not fear what you don't know",
  "You will have a pelasant surprise",
  "Whenever possible, keep it simple",
];

exports.getFortune = () => {
  const idx = Math.floor(Math.random() * fortuneCookies.length);
  return fortuneCookies[idx];
};
