import typescript from "@rollup/plugin-typescript";
// 清空文件夹
import clear from 'rollup-plugin-clear';
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve"; // 帮助查找以及转化外部模块
import commonjs from "@rollup/plugin-commonjs"; // 帮助查找以及转化外部模块
import styles from 'rollup-plugin-styles'
// 处理css less 等的样式
import autoprefixer from "autoprefixer";
// 处理less 嵌套样式写法
import nested from "postcss-nested";
// 转换新的特性
import postcsspresetenv from "postcss-preset-env";
// 压缩css 代码
import cssnano from "cssnano";
import { babel } from '@rollup/plugin-babel'
import nodePolyfills from 'rollup-plugin-polyfill-node';

const path = require('path');

const globalsObject = {
  react: 'react',
  antd: 'antd',
  axios: 'axios',
  moment: 'moment',
  classnames: 'classnames',
  'lodash-es': 'lodash-es',
  'react-dom': 'react-dom',
  'react-router-dom': 'react-router-dom',
  '@ant-design/icons': '@ant-design/icons'
}

const baseOutPutConfig = {
  globals: globalsObject,
  exports: 'named', 
  sourcemap: true,
  preserveModules: true,
  preserveModulesRoot: 'components',
  assetFileNames: ({ name }) => { // 处理资源样式的
    const { dir, base } = path.parse(name)
    return `${dir ? dir + '/' : ''}style/${base}`
  }
}

export default {
  input: './components/index.ts',
  output: { dir: 'lib', format: 'esm', name: 'mj-tools', ...baseOutPutConfig },
  plugins: [
    clear({ targets: ['lib'] }),
    styles({
      use: ['less'],
      mode: 'extract',
      sourcemap: true,
      extensions: [".css", '.less'],
      less: { javascriptEnabled: true },
      plugins: [
        nested(), 
        postcsspresetenv(), 
        cssnano(),
        autoprefixer()
      ]
    }),
    json(),
    commonjs({ include: /node_modules/, }),
    resolve({
      preferBuiltins: true,
      jsnext: true,
      main: true,
      brower: true,
    }),
    typescript(),
    babel({ exclude: "node_modules/**" }),
    nodePolyfills()
  ],
  experimentalCodeSplitting: true,
  external: Object.keys(globalsObject)
};