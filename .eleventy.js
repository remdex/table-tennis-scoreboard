const htmlmin = require("html-minifier");
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const now = String(Date.now());

const SITE_TITLE = "Table Tennis Scoreboard";


module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addWatchTarget("./styles/tailwind.config.js");
  eleventyConfig.addWatchTarget("./styles/tailwind.css");

  eleventyConfig.addPassthroughCopy({ "./_tmp/style.css": "./style.css" });
  eleventyConfig.addPassthroughCopy("./assets");

  eleventyConfig.addShortcode("version", function () {
    return now;
  });

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (
      process.env.ELEVENTY_PRODUCTION &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }
    return content;
  });

  eleventyConfig.addPassthroughCopy({
    "./node_modules/alpinejs/dist/cdn.js": "./js/alpine.js",
  });

  eleventyConfig.addFilter("appendSiteTitle", (value) => {
    if (value.includes(SITE_TITLE)) {
      return value;
    } else {
      return `${value} | ${SITE_TITLE}`;
    }
  })


  return {
    dir: {
      input: "src",
    },
  };
};

