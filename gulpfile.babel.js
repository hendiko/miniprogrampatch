import webpack from "webpack";
import gulp from "gulp";
import pkg from "./package.json";
import path from "path";
import WrapperPlugin from "wrapper-webpack-plugin";
import UglifyJSPlugin from "uglifyjs-webpack-plugin";
import Jasmine from "jasmine";

// since webpack 4.0, webpack is built with UglifyJSPlugin if its mode is production.
var webpackConfig = {
  version: pkg.version,

  name: pkg.name,

  entry: "./src/index.js",

  build(options) {
    let { mode = "none", entry = this.entry } = options || {};
    let isDev = mode !== "production";
    let outputFilename = `${this.name}.js`;
    let outputPath = path.join(__dirname, isDev ? "build" : "dist");

    let plugins = [
      new WrapperPlugin({
        header: `// ${pkg.name} v${
          pkg.version
        } ${new Date().toDateString()}  \n`
      })
    ];
    if (!isDev) {
      plugins.unshift(new UglifyJSPlugin());
    }

    return {
      entry,
      mode: "none", // it should not set mode into production, because the builtin uglifyjs plugin would remove header from bundle file that is added by WrapperPlugin.
      output: {
        path: outputPath,
        filename: outputFilename,
        library: "miniprogrampatch",
        libraryTarget: "umd",
        globalObject: 'typeof self !== "undefined" ? self : this'
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              query: {
                presets: [["es2015", { loose: true }]]
              }
            }
          }
        ]
      },
      plugins
    };
  },

  release() {
    return this.build({ mode: "production" });
  }
};

function webpackRunner(options) {
  let { release } = options || {};
  return new Promise((resolve, reject) => {
    webpack(
      webpackConfig[release ? "release" : "build"](options),
      (err, status) => {
        if (err) {
          reject(err);
        } else {
          resolve(status);
        }
      }
    );
  });
}

gulp.task("release", () => webpackRunner({ release: true }));

gulp.task("default", () => webpackRunner());

gulp.task("next", () => webpackRunner({ entry: "./src/v120/alpha/index" }));

gulp.task("sample", () => {
  return gulp
    .src("./build/miniprogrampatch.js")
    .pipe(gulp.dest("miniprogramapp"));
});

gulp.task("unittest", () => {
  let jasmine = new Jasmine();

  jasmine.loadConfigFile("./spec/support/jasmine.json");
  jasmine.execute();

  return new Promise((resolve, reject) => {
    jasmine.onComplete(success => {
      if (success) {
        resolve("Unit test passed");
      } else {
        reject("Unit test not passed");
      }
    });
  });
});
