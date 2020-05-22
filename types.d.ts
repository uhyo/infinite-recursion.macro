export declare const rec: <Args extends any[], Ret>(
  func: (...args: Args) => Generator<Args, Ret, Ret>,
  ...args: Args
) => Ret;

export declare const infinite: <F extends (...args: any[]) => any>(
  func: F
) => F;

export default infinite;
