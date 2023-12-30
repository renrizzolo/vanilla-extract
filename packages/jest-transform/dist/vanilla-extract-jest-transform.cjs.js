'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./vanilla-extract-jest-transform.cjs.prod.js");
} else {
  module.exports = require("./vanilla-extract-jest-transform.cjs.dev.js");
}
