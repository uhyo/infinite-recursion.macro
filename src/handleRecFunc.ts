import { NodePath } from "@babel/core";
import {
  ArgumentPlaceholder,
  arrayExpression,
  BlockStatement,
  FunctionExpression,
  Identifier,
  yieldExpression,
  JSXNamespacedName,
} from "@babel/types";
import { MacroError } from "babel-plugin-macros";

export const handleRecFunc = (
  funcName: Identifier,
  funcPath: NodePath<FunctionExpression>
): boolean => {
  const blockPath = funcPath.get("body") as NodePath<BlockStatement>;
  const funcScope = blockPath.scope;
  const selfBinding = funcScope.getBinding(funcName.name);
  if (!selfBinding) {
    return false;
  }

  // change this to generator function
  funcPath.node.generator = true;

  for (const path of selfBinding.referencePaths) {
    // `path` is a self-refernce to the recursive function
    const { node, parentPath } = path;
    if (parentPath.isCallExpression() && parentPath.node.callee === node) {
      // rec(...)
      const args = parentPath.node.arguments;
      if (
        args.some(
          (arg) =>
            arg.type === "ArgumentPlaceholder" ||
            arg.type === "JSXNamespacedName"
        )
      ) {
        throw new MacroError("Unsupported argument type");
      }
      const checkedArgs = args as Array<
        Exclude<typeof args[number], ArgumentPlaceholder | JSXNamespacedName>
      >;

      // replace func(...args) with yield [...args]
      const repl = yieldExpression(arrayExpression(checkedArgs));
      parentPath.replaceWith(repl);
      continue;
    }
    throw new MacroError(`Unsupported reference to '${funcName.name}`);
  }
  return true;
};
