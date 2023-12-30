import { IdentifierOption, CreateCompilerOptions } from '@vanilla-extract/integration';
import { Plugin } from 'esbuild';

interface VanillaExtractPluginOptions {
    outputCss?: boolean;
    runtime?: boolean;
    processCss?: (css: string) => Promise<string>;
    identifiers?: IdentifierOption;
    compilerVitePlugins?: CreateCompilerOptions['vitePlugins'];
}
declare function vanillaExtractPlugin({ outputCss, runtime, processCss, identifiers: identOption, compilerVitePlugins: vitePlugins, }?: VanillaExtractPluginOptions): Plugin;

export { vanillaExtractPlugin };
