'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var plugin = require('@parcel/plugin');
var integration = require('@vanilla-extract/integration');

var index = new plugin.Transformer({
  async transform({
    asset,
    options
  }) {
    const identOption = options.mode === 'development' ? 'debug' : 'short';
    const {
      source,
      watchFiles
    } = await integration.compile({
      filePath: asset.filePath,
      cwd: options.projectRoot,
      identOption
    });
    for (const watchFile of watchFiles) {
      asset.invalidateOnFileChange(watchFile);
    }
    const css = [];
    const contents = await integration.processVanillaFile({
      source,
      filePath: asset.filePath,
      outputCss: asset.env.isBrowser(),
      identOption,
      serializeVirtualCssPath: ({
        fileName,
        source: cssSource
      }) => {
        const uniqueKey = fileName;
        css.push({
          type: 'css',
          content: cssSource,
          uniqueKey
        });
        asset.addDependency({
          specifier: uniqueKey,
          specifierType: 'esm'
        });

        // CSS deps are added above so no need to add the import to the file
        return '';
      }
    });
    asset.setCode(contents);
    asset.type = 'js';
    return [asset, ...css];
  }
});

exports["default"] = index;
