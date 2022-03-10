import { terser } from "rollup-plugin-terser"; // 压缩
import filesize from "rollup-plugin-filesize"; // 文件大小

import allConfig from "./rollup.config.base";

// es cjs esm umd
const formatStrAry = ['lib']
// const formatStrAry = ['es']
// const formatStrAry = ['es', 'cjs', 'esm']

let ary = []
formatStrAry.forEach(format => {
  ary = ary.concat(allConfig(format))
})

console.log(ary)

export default ary

// export default {
//   ...baseConfig,
//   plugins: [...baseConfig.plugins, terser(), filesize()],
// };