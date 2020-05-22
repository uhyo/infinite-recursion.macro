import { rec } from "infinite-recursion.macro";

const sum1e7Rec = rec(function sum(upTo) {
  return upTo <= 0 ? 0 : upTo + sum(upTo - 1);
}, 1e6);
console.log(sum1e7Rec);

const sum1e7 = (function sum(upTo) {
  return upTo <= 0 ? 0 : upTo + sum(upTo - 1);
})(1e6);
console.log(sum1e7);
