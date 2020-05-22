const pluginTester = require("babel-plugin-tester").default;
const plugin = require("babel-plugin-macros");

pluginTester({
  plugin,
  snapshot: true,
  babelOptions: { filename: __filename },
  tests: [
    `
      import rec from '../../infinite-recursion.macro'

      console.log(rec(function sumTo(num){
        return num <= 0 ? 0 : num + sumTo(num - 1);
      }, 1e7));
    `,
  ],
});
