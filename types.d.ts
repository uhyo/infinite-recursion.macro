export declare const rec: <Args extends any[], Ret>(
  func: (...args: Args) => Generator<Args, Ret, Ret>,
  ...args: Args
) => Ret;

export default rec;
