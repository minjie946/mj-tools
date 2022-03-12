import { terser } from "rollup-plugin-terser"; // 压缩
import filesize from "rollup-plugin-filesize"; // 文件大小
import baseConfig from "./rollup.config.base";

export default {
  ...baseConfig,
  plugins: [...baseConfig.plugins, terser(), filesize()]
};