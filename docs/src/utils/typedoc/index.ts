import { ReflectionKind, type DeclarationReflection } from "typedoc";
import { project } from "virtual:typedoc";

export const getExports = (): DeclarationReflection[] => project.children!;
export const getExportById = (id: number): DeclarationReflection | undefined =>
  project.children!.find((child) => child.id === id);

export const types: Record<
  number,
  { name: string; symbol: string; color: string }
> = {
  [ReflectionKind.Class]: {
    name: "class",
    symbol: "C",
    color: "#8ac4ff",
  },
  [ReflectionKind.TypeAlias]: {
    name: "type",
    symbol: "T",
    color: "#ff6492",
  },
  [ReflectionKind.Interface]: {
    name: "interface",
    symbol: "I",
    color: "#6cff87",
  },
  [ReflectionKind.Function]: {
    name: "function",
    symbol: "F",
    color: "#a280ff",
  },
};
