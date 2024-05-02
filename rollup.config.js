import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';


// rollup.config.js
/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
	input: 'src/main.ts',
	output: {
		file: 'dist/main.js',
		inlineDynamicImports: true,
		format: 'es'
	},
	plugins: [typescript({ lib: ["ES2015", "dom"] }), nodeResolve(), commonjs()]
};
export default config;