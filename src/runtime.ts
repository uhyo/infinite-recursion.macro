type CallStackItem<Args extends any[], Ret> = {
  iterator: Generator<Args, Ret, Ret>;
  caller: CallStackItem<Args, Ret>;
  lastReturnValue?: Ret;
};

/**
 * Runtime of infinite recursion.
 */
export function runRecursive<Args extends any[], Ret>(
  func: (...args: Args) => Generator<Args, Ret, Ret>,
  ...args: Args
): Ret {
  const rootCaller = {
    lastReturnValue: undefined,
  } as CallStackItem<Args, Ret>;
  const callStack: CallStackItem<Args, Ret>[] = [];
  // Push a call stack for first call
  callStack.push({
    iterator: func(...args),
    lastReturnValue: undefined,
    caller: rootCaller,
  });
  while (callStack.length > 0) {
    const stackFrame = callStack[callStack.length - 1];
    const { iterator, lastReturnValue, caller } = stackFrame;
    // lastReturnValue is initiall undefined, in which case it should not be used
    const res = iterator.next(lastReturnValue as Ret);
    if (res.done) {
      // 関数がreturnしたので親に返り値を記録
      caller.lastReturnValue = res.value;
      callStack.pop();
    } else {
      // The iterator yielded, which means it want to call self recursively
      callStack.push({
        iterator: func(...res.value),
        lastReturnValue: undefined,
        caller: stackFrame,
      });
    }
  }
  return rootCaller.lastReturnValue as Ret;
}
