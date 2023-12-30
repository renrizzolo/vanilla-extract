import { dirname } from 'path';
import { vanillaExtractTransformPlugin, createCompiler, cssFileFilter } from '@vanilla-extract/integration';

const vanillaCssNamespace = 'vanilla-extract-css-ns';
function vanillaExtractPlugin({
  outputCss = true,
  runtime = false,
  processCss,
  identifiers: identOption,
  compilerVitePlugins: vitePlugins
} = {}) {
  if (runtime) {
    // If using runtime CSS then just apply fileScopes and debug IDs to code
    return vanillaExtractTransformPlugin({
      identOption
    });
  }
  return {
    name: 'vanilla-extract',
    async setup(build) {
      const root = build.initialOptions.absWorkingDir || process.cwd();
      const identifiers = identOption || (build.initialOptions.minify ? 'short' : 'debug');
      const compiler = createCompiler({
        root,
        identifiers,
        vitePlugins
      });
      build.onDispose(async () => {
        await compiler.close();
      });
      build.onResolve({
        filter: /\.vanilla\.css/
      }, args => {
        return {
          path: args.path,
          namespace: vanillaCssNamespace
        };
      });
      build.onLoad({
        filter: /.*/,
        namespace: vanillaCssNamespace
      }, async ({
        path
      }) => {
        const [rootRelativePath] = path.split('.vanilla.css');
        let {
          css,
          filePath
        } = compiler.getCssForFile(rootRelativePath);
        if (typeof processCss === 'function') {
          css = await processCss(css);
        }
        return {
          contents: css,
          loader: 'css',
          resolveDir: dirname(filePath)
        };
      });
      build.onLoad({
        filter: cssFileFilter
      }, async ({
        path
      }) => {
        const {
          source,
          watchFiles
        } = await compiler.processVanillaFile(path, {
          outputCss
        });
        return {
          contents: source,
          loader: 'js',
          watchFiles: Array.from(watchFiles)
        };
      });
    }
  };
}

export { vanillaExtractPlugin };
