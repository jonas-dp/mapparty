import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import { uglify } from 'rollup-plugin-uglify';

export default {
    entry: 'js/app.js',
    dest: 'js/main.min.js',
    format: 'iife',
    //sourceMap: 'inline',
    plugins: [
        eslint(),
        babel({
            exclude: 'node_modules/**'
        }),
        uglify(),
    ],
};