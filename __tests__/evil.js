const pluginTester = require("babel-plugin-tester").default;
const plugin = require("babel-plugin-macros");

pluginTester({
  plugin,
  snapshot: true,
  babelOptions: { filename: __filename },
  tests: {
    globalName: `
      import rec from '../../infinite-recursion.macro'
      const _runRecursive = 3;

      console.log(rec(function sumTo(num){
        return num <= 0 ? 0 : num + sumTo(num - 1);
      }, 1e7));
    `,
    local: `
      import rec from '../../infinite-recursion.macro'

      console.log(rec(function sumTo(num){
        const _runRecursive = 3;
        return num <= 0 ? 0 : num + sumTo(num - 1);
      }, 1e7));
    `,
  },
});
