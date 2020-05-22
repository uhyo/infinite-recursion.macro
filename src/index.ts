import { NodePath } from "@babel/core";
import { createMacro } from "babel-plugin-macros";
import { isFunctionExpression, FunctionExpression } from "@babel/types";
import { handleRecFunc } from "./handleRecFunc";

export = createMacro(({ references, state, babel }) => {
  const recFuncReferences = [
    ...(references.default || []),
    ...(references.rec || []),
  ];
  for (const path of recFuncReferences) {
    const { node, parentPath } = path;
    if (parentPath.isCallExpression() && parentPath.node.callee === node) {
      // rec(...)
      const { node: parent } = parentPath;
      const args = parent.arguments;
      if (args.length === 0) {
        // invalid: rec()
        continue;
      }
      const firstArg = args[0];
      if (!isFunctionExpression(firstArg)) {
        continue;
      }

      // rec(function () { ... }, ...)
      if (!firstArg.id) {
        continue;
      }
      if (firstArg.generator || firstArg.async) {
        continue;
      }
      const funcPath = (parentPath.get("arguments.0") as unknown) as NodePath<
        FunctionExpression
      >;
      handleRecFunc(firstArg.id, funcPath);
    }
  }
});
