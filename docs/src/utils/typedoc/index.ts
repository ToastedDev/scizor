import { ReflectionKind, type DeclarationReflection } from "typedoc";
import { project } from "virtual:typedoc";

export const getExports = (): DeclarationReflection[] => project.children!;
export const getExportById = (
  id: number,
): (DeclarationReflection & { parent?: DeclarationReflection }) | undefined => {
  const parent = project.children!.find((child) =>
    child.children!.find((node) => node.id === id),
  );
  if (!parent) return;

  const child = parent.children!.find((node) => node.id === id);
  if (!child) return;

  return {
    ...child,
    parent: parent.name !== "types/options" ? parent : undefined,
  } as any;
};
export const getVersion = () => project.packageVersion;

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
