import { NodePath } from "@babel/core";
import {
  FunctionExpression,
  isFunctionExpression,
  Program,
} from "@babel/types";
import { createMacro } from "babel-plugin-macros";
import { handleRecFunc } from "./handleRecFunc";
import { importInDecl } from "./importInDecl";
import { importRuntime } from "./importRuntime";

// `source` is not in @types/babel-plugin-macros :(
// @ts-expect-error
export = createMacro(({ references, state, babel, source }) => {
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
      const res = handleRecFunc(firstArg.id, funcPath);
      if (!res) {
        continue;
      }
      // wrap with runtime
      const programScope = path.scope.getProgramParent();
      programScope.path;
      const programPath = programScope.path as NodePath<Program>;
      const importDecl = importRuntime(programPath, source);
      const runRecursiveLoc = importInDecl(
        importDecl,
        programScope,
        "runRecursive"
      );
      // replace rec(...) with runRecursive(...)
      path.replaceWith(runRecursiveLoc);
    }
  }
});
