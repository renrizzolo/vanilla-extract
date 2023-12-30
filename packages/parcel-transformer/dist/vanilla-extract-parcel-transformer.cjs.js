'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./vanilla-extract-parcel-transformer.cjs.prod.js");
} else {
  module.exports = require("./vanilla-extract-parcel-transformer.cjs.dev.js");
}
