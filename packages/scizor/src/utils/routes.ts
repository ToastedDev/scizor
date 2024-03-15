import { type ParsedPath } from "path";
import { mergePaths } from "./tree";

export const buildRoute = (parsedFile: ParsedPath) => {
  const directory = parsedFile.dir === parsedFile.root ? "" : parsedFile.dir;
  const name = parsedFile.name.startsWith("route")
    ? parsedFile.name.replace("route", "")
    : parsedFile.name;
  return directory + name;
};

export const buildUrl = (path: string) => {
  const convertParamSyntax = (path: string) => {
    const subpaths: string[] = [];
    for (const subpath of path.split("/")) {
      subpaths.push(transformBrackets(subpath));
    }
    return mergePaths(...subpaths);
  };
  const transformBrackets = (value: string) => {
    const regBrackets = /\[([^}]*)\]/g;
    return regBrackets.test(value)
      ? value.replace(regBrackets, (_, s) => `:${s}`)
      : value;
  };

  const url = convertParamSyntax(path);
  return url.replace(/:\.\.\.\w+/g, "*");
};

export const calculatePriority = (url: string) => {
  const depth = url.match(/\/.+?/g)?.length || 0;
  const specifity = url.match(/\/:.+?/g)?.length || 0;
  const catchall = url.match(/\/\*/g)?.length || 0 > 0 ? Infinity : 0;
  return depth + specifity + catchall;
};
