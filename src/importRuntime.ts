import {
  Program,
  ImportDeclaration,
  importDeclaration,
  stringLiteral,
} from "@babel/types";
import type { Scope, NodePath } from "@babel/traverse";

const importDeclarationMap = new WeakMap<Program, ImportDeclaration>();

/**
 * Import runtime function into given Program.
 */
export function importRuntime(
  programPath: NodePath<Program>,
  source: string
): ImportDeclaration {
  const { node: program } = programPath;
  const cache = importDeclarationMap.get(program);
  if (cache) {
    return cache;
  }
  const decl = importDeclaration([], stringLiteral(`${source}/lib/runtime`));
  importDeclarationMap.set(program, decl);
  // add it to program
  program.body.unshift(decl);

  return decl;
}
