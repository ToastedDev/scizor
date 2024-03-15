import { darkTheme } from "@/utils/themes/dark";
import { lightTheme } from "@/utils/themes/light";
import { types } from "@/utils/typedoc";
import { getHighlighterCore } from "shiki/core";
import getWasm from "shiki/wasm";
import {
  ReflectionKind,
  type DeclarationReflection,
  type SomeType,
} from "typedoc";

const highlighter = await getHighlighterCore({
  themes: [lightTheme as any, darkTheme as any],
  langs: [import("shiki/langs/typescript.mjs")],
  loadWasm: getWasm,
});

function generateCode(child: DeclarationReflection) {
  let code = `${types[child.kind].name} ${child.name}`;
  if (
    child.kind === ReflectionKind.Interface ||
    child.kind === ReflectionKind.TypeAlias
  ) {
    if (child.children) {
      code +=
        " " + (child.kind === ReflectionKind.TypeAlias ? "=" : "") + " {\n";
      for (const property of child.children) {
        code += `  ${property.name}${
          property.flags.isOptional ? "?" : ""
        }: ${getType(property.type!)}\n`;
      }
      code += "}";
    } else if (child.type!.type === "union")
      code +=
        " " +
        (child.kind === ReflectionKind.Interface ? " = " : "") +
        getType(child.type!);
    else if (child.type!.type === "reference")
      code += ` ${child.kind === ReflectionKind.TypeAlias ? "=" : "extends"} ${
        child.type!.name
      }`;
  } else if (child.kind === ReflectionKind.Function) {
    code += "(";
    code += child.signatures?.[0].parameters
      ?.map(
        (parameter) =>
          `${parameter.name}${
            parameter.flags.isOptional || parameter.defaultValue ? "?" : ""
          }: ${getType(parameter.type!)}${
            parameter.defaultValue ? ` = ${parameter.defaultValue}` : ""
          }`,
      )
      .join(", ");
    code += "): ";
    code += getType(child.signatures![0].type!);
  }
  return code;
}

function getType(type: SomeType) {
  let typeName = "";
  switch (type.type) {
    case "intrinsic":
    case "reference":
      typeName = type.name;
      break;
    case "intersection":
      typeName = type.types.map((type) => getType(type)).join(" & ");
      break;
    case "union":
      typeName = type.types.map((type) => getType(type)).join(" | ");
      break;
    case "reflection":
      switch (type.declaration.kind) {
        case ReflectionKind.TypeLiteral:
          {
            if (type.declaration.children) {
              typeName = `{ ${type.declaration.children.map(
                (child) =>
                  `${child.name}${child.flags.isOptional ? "?" : ""}: ${getType(
                    child.type!,
                  )}`,
              )} }`;
            }
          }
          break;
      }
      break;
  }
  return typeName;
}

export function Excerpt({
  child,
  className,
}: {
  child: DeclarationReflection;
  className?: string;
}) {
  const codeHTML = highlighter.codeToHtml(generateCode(child), {
    lang: "typescript",
    themes: {
      light: "lambda-whiteout",
      dark: "lambda-blackout",
    },
  });

  return (
    <>
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: codeHTML }}
      />
    </>
  );
}
