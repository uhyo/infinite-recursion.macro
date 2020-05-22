const pluginTester = require("babel-plugin-tester").default;
const plugin = require("babel-plugin-macros");

pluginTester({
  plugin,
  snapshot: true,
  babelOptions: { filename: __filename },
  tests: {
    basic: `
      import { rec } from '../../infinite-recursion.macro'

      console.log(rec(function sumTo(num){
        return num <= 0 ? 0 : num + sumTo(num - 1);
      }, 1e7));
    `,
    multipleReferencesInOneRec: `
      import { rec } from '../../infinite-recursion.macro'

      console.log(rec(function fib(num){
        return num <= 1 ? num : fib(num - 1) + fib(num - 2)
      }, 1e7));
    `,
    multipleRecs: `
      import { rec } from '../../infinite-recursion.macro'

      console.log(rec(function sumTo(num){
        return num <= 0 ? 0 : num + sumTo(num - 1);
      }, 1e7));
      console.log(rec(function fib(num){
        return num <= 1 ? num : fib(num - 1) + fib(num - 2)
      }, 1e7));
    `,
    nested: `
      import { rec } from '../../infinite-recursion.macro'

      console.log(rec(function sumTo(num){
        const f = rec(function fib(num){
          return num <= 1 ? num : fib(num - 1) + fib(num - 2)
        }, 1e5);

        return num <= 0 ? 0 : num + sumTo(num - 1);
      }, 1e7));
    `,
  },
});
