import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'
// 用来做 import xxx from './src/test' => 指向 './src/test/index.js'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: './src/index.js',
  output: {
    format: 'umd',
    name: 'Vue',
    file: 'dist/umd/vue.js',
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    serve({
      open: true,
      port: 3000,
      contentBase: '',
      openPage: './index.html'
    }),
    commonjs()
  ]
}