import allConfig from "./rollup.config.base";

// es cjs esm umd
const formatStrAry = ['lib']

let ary = []
formatStrAry.forEach(format => {
  ary = ary.concat(allConfig(format))
})

export default ary