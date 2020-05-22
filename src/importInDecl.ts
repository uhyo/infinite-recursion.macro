import {
  ImportDeclaration,
  Identifier,
  isImportDefaultSpecifier,
  isImportSpecifier,
  importDefaultSpecifier,
  importSpecifier,
  identifier,
} from "@babel/types";
import { Scope } from "@babel/traverse";

export function importInDecl(
  decl: ImportDeclaration,
  scope: Scope,
  name: string
): Identifier {
  const existing =
    name === "default"
      ? decl.specifiers.find((s) => isImportDefaultSpecifier(s))
      : decl.specifiers.find(
          (s) => isImportSpecifier(s) && s.imported.name === name
        );
  if (existing) {
    return existing.local;
  }
  const loc = identifier(scope.generateUid(name));
  const newSpecifier =
    name === "default"
      ? importDefaultSpecifier(loc)
      : importSpecifier(loc, identifier(name));
  decl.specifiers.push(newSpecifier);
  return loc;
}
