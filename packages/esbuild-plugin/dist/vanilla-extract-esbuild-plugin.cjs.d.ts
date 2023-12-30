import { IdentifierOption, CompileOptions } from '@vanilla-extract/integration';
import { Plugin } from 'esbuild';

interface VanillaExtractPluginOptions {
    outputCss?: boolean;
    /**
     * @deprecated Use `esbuildOptions.external` instead.
     */
    externals?: Array<string>;
    runtime?: boolean;
    processCss?: (css: string) => Promise<string>;
    identifiers?: IdentifierOption;
    esbuildOptions?: CompileOptions['esbuildOptions'];
}
declare function vanillaExtractPlugin({ outputCss, externals, runtime, processCss, identifiers, esbuildOptions, }?: VanillaExtractPluginOptions): Plugin;

export { vanillaExtractPlugin };
