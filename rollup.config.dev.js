import baseConfig from "./rollup.config.base";
import serve from "rollup-plugin-serve"; // 服务的
import livereload from "rollup-plugin-livereload";

export default {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    serve({
      contentBase: "",
      port: 8020,
    }),
    livereload("components"),
  ],
};