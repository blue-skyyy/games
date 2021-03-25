const path = require("path");

// https://blog.csdn.net/hbiao68/article/details/108972775

export default {
  alias: {
    "/@/": path.resolve(__dirname, "..", "src"),
    "/@utils/": path.resolve(__dirname, "/src/", "utils"),
    "/@components/": path.resolve(__dirname, "src", "components")
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        oneOf: [
          {
            resourceQuery: /^\?vue/,
            use: ["pug-plain-loader"]
          },
          {
            use: ["html-loader", "pug-html-loader"]
          }
        ]
      }
    ]
  }
};
