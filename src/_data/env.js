require("dotenv").config();

const common = { };

const testing = {
  ...common,
  url: "http://localhost:8080",
};

const production = {
  ...common,
  url: "https://tabletennisscoreboard.com",
};

module.exports = process.env.ELEVENTY_PRODUCTION ? production : testing;
