"use strict";

const errorOverlayMiddleware = require("react-dev-utils/errorOverlayMiddleware");
const evalSourceMapMiddleware = require("react-dev-utils/evalSourceMapMiddleware");
const noopServiceWorkerMiddleware = require("react-dev-utils/noopServiceWorkerMiddleware");
const ignoredFiles = require("react-dev-utils/ignoredFiles");
const paths = require("./paths");
const fs = require("fs");
const path = require("path");

const protocol = process.env.HTTPS === "true" ? "https" : "http";
const host = process.env.HOST || "0.0.0.0";

module.exports = function (proxy, allowedHost) {
  return {
    // Webpack-dev-server v5 configuration
    allowedHosts: !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === "true" ? "all" : [allowedHost],
    // Enable gzip compression of generated files.
    compress: true,
    // Client logging and overlay
    client: {
      logging: "none",
      overlay: false,
      progress: false
    },
    // Serve static files from public folder
    static: {
      directory: paths.appPublic,
      publicPath: ["/"],
      watch: {
        ignored: ignoredFiles(paths.appSrc)
      }
    },
    // Enable hot reloading
    hot: true,
    // DevMiddleware options (replaces publicPath at root level)
    devMiddleware: {
      publicPath: "/"
    },
    // Enable HTTPS if the HTTPS environment variable is set to 'true'
    server: protocol === "https" ? "https" : "http",
    host,
    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      disableDotRule: true
    },
    port: parseInt(process.env.PORT, 10) || 3000,
    proxy,
    setupMiddlewares(middlewares, devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // Get the express app
      const app = devServer.app;
      if (fs.existsSync(paths.proxySetup)) {
        // This registers user provided middleware for proxy reasons
        require(paths.proxySetup)(app);
      }

      // This lets us fetch source contents from webpack for the error overlay
      app.use(evalSourceMapMiddleware(devServer));
      // This lets us open files from the runtime error overlay.
      app.use(errorOverlayMiddleware());

      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
      app.use(noopServiceWorkerMiddleware('/'));

      // use proper mime-type for wasm files
      // app.get('*.wasm', function(req, res, next) {
      //     var options = {
      //       root: path.join(__dirname, "../public"),
      //       dotfiles: "deny",
      //       headers: {
      //         "Content-Type": "application/wasm"
      //       }
      //     };
      //     res.sendFile(req.url, options, function (err) {
      //         if (err) {
      //             next(err);
      //         }
      //     });
      // });

      app.get("/res/models/:filename", function (req, res, next) {
        const options = {
          root: path.join(__dirname, "../src/res/models"),
          dotfiles: "deny",
          headers: {
            "x-timestamp": Date.now(),
            "x-sent": true
          }
        };

        const fileName = req.params.filename;
        res.sendFile(fileName, options, function (err) {
          if (err) {
            next(err);
          }
        });
      });
      app.get("/res/saves/:filename", function (req, res, next) {
        const options = {
          root: path.join(__dirname, "../src/res/saves"),
          dotfiles: "deny",
          headers: {
            "x-timestamp": Date.now(),
            "x-sent": true
          }
        };

        const fileName = req.params.filename;
        res.sendFile(fileName, options, function (err) {
          if (err) {
            next(err);
          }
        });
      });

      return middlewares;
    }
  };
};
