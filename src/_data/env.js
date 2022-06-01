require("dotenv").config();

const common = {
  url: process.env.URL,
};

const testing = {
  ...common,
};

const production = {
  ...common,
};

module.exports = process.env.ELEVENTY_PRODUCTION ? production : testing;
