const pluginTester = require("babel-plugin-tester").default;
const plugin = require("babel-plugin-macros");

pluginTester({
  plugin,
  snapshot: true,
  babelOptions: { filename: __filename },
  tests: {
    basic: `
      import { infinite } from '../../infinite-recursion.macro'

      const sumTo = infinite(function sumTo(num) {
        return num <= 0 ? 0 : num + sumTo(num - 1);
      })
    `,
    multipleReferencesInOneRec: `
      import { infinite } from '../../infinite-recursion.macro'

      const fib = infinite(function fib(num){
        return num <= 1 ? num : fib(num - 1) + fib(num - 2)
      });
    `,
    multipleRecs: `
      import { infinite } from '../../infinite-recursion.macro'

      const sumTo = infinite(function sumTo(num){
        return num <= 0 ? 0 : num + sumTo(num - 1);
      });
      const fib = infinite(function fib(num){
        return num <= 1 ? num : fib(num - 1) + fib(num - 2)
      });
    `,
    nested: `
      import { infinite } from '../../infinite-recursion.macro'

      const sumTo = infinite(function sumTo(num){
        const f = infinite(function fib(num){
          return num <= 1 ? num : fib(num - 1) + fib(num - 2)
        });

        return num <= 0 ? 0 : num + sumTo(num - 1);
      });
    `,
  },
});
