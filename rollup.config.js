import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';


/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
	input: 'src/main.ts',
	output: {
		dir: 'dist',
		format: 'es',
		chunkFileNames: "[name].js",
		manualChunks(id, info) {
			if (id.includes('worker')) {
				return 'worker/index'
			}
			if (id.includes('alea')) {
				return 'worker/vendor';
			}
			if (id.includes('fastpriorityqueue')) {
				return 'worker/vendor';
			}
			if (id.includes('lodash')) {
				return 'worker/vendor';
			}
			if (id.includes('src')) {
				return 'main';
			}
			if (id.includes('kaboom')) {
				return 'kaboom';
			}
			return 'vendor';
		}
	},
	presets: ['@babel/preset-env'],
	plugins: [
		typescript({ target: "ES6", allowSyntheticDefaultImports: true }),
		nodeResolve(),
		commonjs({
			ignoreGlobal: true,
			defaultIsModuleExports: true,
		}),
		babel({
			babelHelpers: 'bundled',
			plugins: [
				"@babel/plugin-proposal-class-static-block",
				"@babel/plugin-transform-class-properties"
			]
		})
	]
};
export default config;