A [Babel Macro](https://github.com/kentcdodds/babel-plugin-macros) that allows your functions to recurse infinitely.

[![Babel Macro](https://img.shields.io/badge/babel--macro-%F0%9F%8E%A3-f5da55.svg?style=flat-square)](https://github.com/kentcdodds/babel-plugin-macros)

## Problem

In typical environments like V8, number of recursion is limited to tens of thousands.

```js
function sum(upTo) {
  return upTo <= 0 ? 0 : upTo + sum(upTo - 1);
}

// RangeError: Maximum call stack size exceeded
console.log(sum(1e6));
```

## Solution

With the `infinite` macro, your function supports infinite number of recursion.

```js
import { infinite } from "infinite-recursion.macro";

const sum = infinite(function sum(upTo) {
  return upTo <= 0 ? 0 : upTo + sum(upTo - 1);
});

// 500000500000
console.log(sum(1e6));
```

## Usage

Configure Babel to use [babel-pugin-macros](https://github.com/kentcdodds/babel-plugin-macros). That's all!

### `infinite`

The `infinite` macro supports the form of `infinite(function func(...args) { ... })`. Any other form of expressions will result in a compile-time or runtime error.

If you are a fan of default exports, the `infinite` macro can also be obtained as a default export:

```js
import infinite from "infinite-recursion.macro";
```

### `run`

The `rec` macro is an inline version of the `infinite` macro. It receives a recursive function as the first argument and the arguments to it as the rest of the arguments. Usage:

```js
import { run } from "infinite-recursion.macro";

const sumTo1e6 = run(function sum(upTo) {
  return upTo <= 0 ? 0 : upTo + sum(upTo - 1);
}, 1e6);
```

## Contribution

Welcome

## License

MIT
