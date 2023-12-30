'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var integration = require('@vanilla-extract/integration');
var esbuild = require('esbuild');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var path__default = /*#__PURE__*/_interopDefault(path);
var esbuild__namespace = /*#__PURE__*/_interopNamespace(esbuild);

const vanillaTransformer = {
  canInstrument: false,
  process(source, filePath, options) {
    if (!integration.cssFileFilter.test(filePath)) {
      // If the file that passes through to the transformer is not a VE file,
      // then it's likely a vanilla .css file (because Jest can't differentiate
      // between them)
      return {
        code: `module.exports = ${JSON.stringify(path__default["default"].basename(filePath))};`
      };
    }
    const {
      name: packageName
    } = integration.getPackageInfo(options.config.rootDir);
    const code = integration.transformSync({
      source,
      filePath,
      rootPath: options.config.rootDir,
      packageName: packageName,
      identOption: 'debug'
    });
    const result = esbuild__namespace.transformSync(code, {
      format: options.supportsStaticESM ? 'esm' : 'cjs',
      target: 'es2018',
      loader: 'ts'
    });
    return result;
  }
};

exports["default"] = vanillaTransformer;
