const htmlmin = require("html-minifier");
const markdownIt = require('markdown-it');
const mdFigcaption = require("markdown-it-image-figures");
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const EleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const now = String(Date.now());

const SITE_TITLE = "My Website";

let figoptions = {
  figcaption: true,
};

const mdLib = markdownIt({}).use(mdFigcaption, figoptions);

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(EleventyNavigationPlugin);
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

  eleventyConfig.addNunjucksFilter("niceDate", (value) => {
    return new Date(value).toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });
  });

  eleventyConfig.addFilter("sortByIndex", (value) => {
    value.sort((a, b) => a.data.index - b.data.index)
    return value;
  })
  eleventyConfig.addFilter("appendSiteTitle", (value) => {
    if (value.includes(SITE_TITLE)) {
      return value;
    } else {
      return `${value} | ${SITE_TITLE}`;
    }
  })

  eleventyConfig.setLibrary("md", mdLib);

  return {
    dir: {
      input: "src",
    },
  };
};

