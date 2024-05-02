import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';


/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
	input: 'src/main.ts',
	output: {
		dir: 'dist',
		format: 'es',
		chunkFileNames: "[name].js",
		manualChunks(id) {
			if (id.includes('worker')) {
				return 'worker/index'
			}
			if (id.includes('src')) {
				return 'main';
			}
			return 'vendor';
		}
	},
	plugins: [
		typescript({ target: "ES6", allowSyntheticDefaultImports: true }),
		nodeResolve(),
		commonjs(),
	]
};
export default config;