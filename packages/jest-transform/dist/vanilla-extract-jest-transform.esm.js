import path from 'path';
import { cssFileFilter, getPackageInfo, transformSync } from '@vanilla-extract/integration';
import * as esbuild from 'esbuild';

const vanillaTransformer = {
  canInstrument: false,
  process(source, filePath, options) {
    if (!cssFileFilter.test(filePath)) {
      // If the file that passes through to the transformer is not a VE file,
      // then it's likely a vanilla .css file (because Jest can't differentiate
      // between them)
      return {
        code: `module.exports = ${JSON.stringify(path.basename(filePath))};`
      };
    }
    const {
      name: packageName
    } = getPackageInfo(options.config.rootDir);
    const code = transformSync({
      source,
      filePath,
      rootPath: options.config.rootDir,
      packageName: packageName,
      identOption: 'debug'
    });
    const result = esbuild.transformSync(code, {
      format: options.supportsStaticESM ? 'esm' : 'cjs',
      target: 'es2018',
      loader: 'ts'
    });
    return result;
  }
};

export { vanillaTransformer as default };
