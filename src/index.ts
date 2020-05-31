import { NodePath } from "@babel/core";
import {
  FunctionExpression,
  isFunctionExpression,
  Program,
  Expression,
  SpreadElement,
  JSXNamespacedName,
  ArgumentPlaceholder,
  Identifier,
} from "@babel/types";
import { createMacro } from "babel-plugin-macros";
import { handleRecFunc } from "./handleRecFunc";
import { importInDecl } from "./importInDecl";
import { importRuntime } from "./importRuntime";

// `source` is not in @types/babel-plugin-macros :(
// @ts-expect-error
export = createMacro(({ references, state, babel, source }) => {
  const recFuncReferences = [...(references.rec || [])];
  const infiniteFuncReferences = [
    ...(references.default || []),
    ...(references.infinite || []),
  ];
  for (const path of recFuncReferences) {
    convertRefFuncReference(path, source);
  }
  for (const path of infiniteFuncReferences) {
    convertInfiniteFuncReference(path, source);
  }
});

function convertRefFuncReference(path: NodePath, source: string) {
  const { node, parentPath } = path;
  if (parentPath.isCallExpression() && parentPath.node.callee === node) {
    // rec(...)
    const { node: parent } = parentPath;
    const args = parent.arguments;
    if (args.length === 0) {
      // invalid: rec()
      return;
    }
    const firstArg = args[0];
    if (!checkForNamedFunctionExpression(firstArg)) {
      return;
    }
    const funcPath = (parentPath.get("arguments.0") as unknown) as NodePath<
      FunctionExpression
    >;
    const res = handleRecFunc(firstArg.id, funcPath);
    if (!res) {
      return;
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

function convertInfiniteFuncReference(path: NodePath, source: string) {
  const { node, parentPath } = path;
  if (parentPath.isCallExpression() && parentPath.node.callee === node) {
    // infinite(...)
    const { node: parent } = parentPath;
    const args = parent.arguments;
    if (args.length !== 1) {
      // invalid
      return;
    }
    const [firstArg] = args;
    if (!checkForNamedFunctionExpression(firstArg)) {
      return;
    }
    const funcPath = (parentPath.get("arguments.0") as unknown) as NodePath<
      FunctionExpression
    >;
    const res = handleRecFunc(firstArg.id, funcPath);
    if (!res) {
      return;
    }
    // wrap with runtime
    const programScope = path.scope.getProgramParent();
    programScope.path;
    const programPath = programScope.path as NodePath<Program>;
    const importDecl = importRuntime(programPath, source);
    const runRecursiveLoc = importInDecl(
      importDecl,
      programScope,
      "makeInfinite"
    );
    // replace infinite(...) with makeInfinite(...)
    path.replaceWith(runRecursiveLoc);
  }
}

/**
 * Returns true if given FunctionExpression can be converted.
 */
function checkForNamedFunctionExpression(
  node: Expression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder
): node is FunctionExpression & { id: Identifier } {
  if (!isFunctionExpression(node)) {
    return false;
  }
  if (!node.id) {
    return false;
  }
  if (node.generator || node.async) {
    return false;
  }
  return true;
}
