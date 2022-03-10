import typescript from "@rollup/plugin-typescript";
// 清空文件夹
import clear from 'rollup-plugin-clear';
import pkg from "./package.json";
import { terser } from "rollup-plugin-terser"; // 压缩
import filesize from "rollup-plugin-filesize"; // 文件大小
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve"; // 帮助查找以及转化外部模块
import commonjs from "@rollup/plugin-commonjs"; // 帮助查找以及转化外部模块
// import eslint from "@rollup/plugin-eslint";
// 处理css less 等的样式
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
// 处理less 嵌套样式写法
import nested from "postcss-nested";
// 转换新的特性
import postcsspresetenv from "postcss-preset-env";
// 压缩css 代码
import cssnano from "cssnano";
import { babel } from '@rollup/plugin-babel'
import nodePolyfills from 'rollup-plugin-polyfill-node';

const fs = require('fs');
const path = require('path');
const componentDir = 'components';

const libraryName = 'mj-tools'

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

const externalAry = [ // 不需要打包的包
  'react', 'react-dom','react-router-dom', 'antd', 'axios',
  'classnames', 'lodash-es', 'moment', '@ant-design/icons'
]

const inputPathAry = []
const inputPath = {}
function readdirDir (pathDir, filedir, name) {
  const files = fs.readdirSync(pathDir)
  files.forEach(function (dir) {
    const pathChild = pathDir + '/' + dir
    const stat = fs.lstatSync(pathChild)
    // 是文件夹则循环获取里面的文件
    if (stat.isDirectory()) readdirDir(pathChild, filedir + '/' + dir, dir)
    // 不是则保存文件的地址
    if (stat.isFile() && /index(.ts|.tsx)/.test(dir)) {
      // console.log(componentDir, filedir, dir)
      const path = './' + componentDir + filedir + '/' + dir
      inputPath[name] = path
      const inputObj = {}
      inputObj[name] = path
      inputPathAry.push({ input: inputObj, name })
    }
  })
}

readdirDir(path.resolve(componentDir), '', 'index')

const entryFileNames = (chunkInfo) => {
  return chunkInfo.name === 'index' ? '[name].js' : '[name]/index.js'
}


// console.log(inputPathAry)

export function createModuleConfig (libName, moduleName, input) {
  const obj = {
    input: input,
    output: {
      dir: libName,
      format: libName === 'lib' ? 'umd' : libName,
      entryFileNames,
      exports: 'named',
      globals: globalsObject,
      sourcemap: true
    },
    plugins: [
      clear({ targets: [`${libName}/${moduleName}`] }),
      postcss({
        use: [['less', { javascriptEnabled: true }]],
        plugins: [
          nested(), 
          postcsspresetenv(), 
          cssnano(),
          autoprefixer()
        ],
        // inject: false,
        extensions: [".css",'.less'],
        // extract: false
        extract: `${moduleName}/style/index.css` 
      }),
      json(),
      commonjs({ include: /node_modules/, }),
      resolve({
        preferBuiltins: true,
        jsnext: true,
        main: true,
        brower: true,
      }),
      typescript({ outDir: libName, declarationDir: libName }),
      babel({ exclude: "node_modules/**" }),
      nodePolyfills(),
      terser(),
      filesize()
    ],
    experimentalCodeSplitting: libName !== 'umd',
    external: externalAry
  };
  if (libName === 'lib') {
    obj.output['name'] = libraryName
  }
  return obj
}

export default function allConfig (libName) {
  let ary = inputPathAry.map((obj) => createModuleConfig(libName, obj.name, obj.input))
  return ary
}

// function createConfig (libName) {
//   const output = { dir: libName, format: libName, entryFileNames, exports: 'named', globals: globalsObject, sourcemap: true }
//   return {
//     input: {
//       config: "./components/config.ts",
//       ...inputPath
//     },
//     output,
//     plugins: [
//       clear({ targets: [libName] }),
//       postcss({
//         use: [['less', { javascriptEnabled: true }]],
//         plugins: [
//           nested(), 
//           postcsspresetenv(), 
//           cssnano(),
//           autoprefixer()
//         ],
//         extensions: [".css",'.less'],
//         extract: `${libName}/${moduleName}/style/index.css` 
//       }),
//       json(),
//       commonjs({ include: /node_modules/, }),
//       resolve({
//         preferBuiltins: true,
//         jsnext: true,
//         main: true,
//         brower: true,
//       }),
//       typescript({ outDir: libName, declarationDir: libName }),
//       babel({ exclude: "node_modules/**" }),
//       nodePolyfills()
//     ],
//     experimentalCodeSplitting: libName !== 'umd',
//     external: externalAry
//   };
// }

// es cjs esm umd
// export default createConfig
