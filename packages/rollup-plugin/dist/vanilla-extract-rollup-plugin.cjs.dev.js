'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var integration = require('@vanilla-extract/integration');
var path = require('path');

const {
  relative,
  normalize,
  dirname
} = path.posix;
function vanillaExtractPlugin({
  identifiers,
  cwd = process.cwd(),
  esbuildOptions
} = {}) {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    name: 'vanilla-extract',
    // Transform .css.js to .js
    async transform(_code, id) {
      if (!integration.cssFileFilter.test(id)) {
        return null;
      }
      const index = id.indexOf('?');
      const filePath = index === -1 ? id : id.substring(0, index);
      const identOption = identifiers !== null && identifiers !== void 0 ? identifiers : isProduction ? 'short' : 'debug';
      const {
        source,
        watchFiles
      } = await integration.compile({
        filePath,
        cwd,
        esbuildOptions,
        identOption
      });
      for (const file of watchFiles) {
        this.addWatchFile(file);
      }
      const output = await integration.processVanillaFile({
        source,
        filePath,
        identOption
      });
      return {
        code: output,
        map: {
          mappings: ''
        }
      };
    },
    // Resolve .css to external module
    async resolveId(id) {
      if (!integration.virtualCssFileFilter.test(id)) {
        return null;
      }
      const {
        fileName,
        source
      } = await integration.getSourceFromVirtualCssFile(id);
      return {
        id: fileName,
        external: true,
        meta: {
          css: source
        }
      };
    },
    // Emit .css assets
    moduleParsed(moduleInfo) {
      moduleInfo.importedIdResolutions.forEach(resolution => {
        if (resolution.meta.css) {
          resolution.meta.assetId = this.emitFile({
            type: 'asset',
            name: resolution.id,
            source: resolution.meta.css
          });
        }
      });
    },
    // Replace .css import paths with relative paths to emitted css files
    renderChunk(code, chunkInfo) {
      var _chunkInfo$map;
      const chunkPath = dirname(chunkInfo.fileName);
      const output = chunkInfo.imports.reduce((codeResult, importPath) => {
        const moduleInfo = this.getModuleInfo(importPath);
        if (!(moduleInfo !== null && moduleInfo !== void 0 && moduleInfo.meta.assetId)) {
          return codeResult;
        }
        const assetPath = this.getFileName(moduleInfo === null || moduleInfo === void 0 ? void 0 : moduleInfo.meta.assetId);
        const relativeAssetPath = `./${normalize(relative(chunkPath, assetPath))}`;
        return codeResult.replace(importPath, relativeAssetPath);
      }, code);
      return {
        code: output,
        map: (_chunkInfo$map = chunkInfo.map) !== null && _chunkInfo$map !== void 0 ? _chunkInfo$map : null
      };
    }
  };
}

exports.vanillaExtractPlugin = vanillaExtractPlugin;
