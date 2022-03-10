import allConfig from "./rollup.config.base";
// es cjs esm umd
const formatStrAry = ['es']
let ary = []
formatStrAry.forEach(format => {
  ary = ary.concat(allConfig(format))
})
export default ary

// export default {
//   ...baseConfig,
//   plugins: [...baseConfig.plugins, terser(), filesize()],
// };