import { getExportById, types } from "@/utils/typedoc";
import {
  ReflectionKind,
  type DeclarationReflection,
  type SomeType,
} from "typedoc";
import {
  VscSymbolMethod,
  VscSymbolParameter,
  VscSymbolProperty,
} from "react-icons/vsc";
import { marked } from "marked";
import { Badge } from "../ui/badge";

function getType(type: SomeType, links: boolean = true) {
  let typeName = "";
  switch (type.type) {
    case "intrinsic":
      typeName = type.name;
      break;
    case "reference":
      {
        if (links) {
          const typeTarget = (type as any).target;
          if (typeof typeTarget === "number") {
            const item = getExportById(typeTarget);
            if (item)
              typeName = `<a href="/api${
                types[item.kind] ? `/${types[item.kind].name}/` : "/"
              }${item.name}" class="text-primary hover:underline">${
                type.name
              }</a>`;
            else typeName = type.name;
          } else typeName = type.name;
        } else typeName = type.name;
      }
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

const getConstructors = (child: DeclarationReflection) =>
  child.groups
    ?.find((group) => group.title === "Constructors")
    ?.children.map(
      (childId) =>
        child.children!.find(
          (child) => child.id === (childId as unknown as number),
        )!,
    );
const getParameters = (child: DeclarationReflection) =>
  child.signatures?.[0]?.parameters;
const getProperties = (child: DeclarationReflection) =>
  child.groups
    ?.find((group) => group.title === "Properties")
    ?.children.map(
      (childId) =>
        child.children!.find(
          (child) => child.id === (childId as unknown as number),
        )!,
    );
const getMethods = (child: DeclarationReflection) =>
  child.groups
    ?.find((group) => group.title === "Methods")
    ?.children.map(
      (childId) =>
        child.children!.find(
          (child) => child.id === (childId as unknown as number),
        )!,
    );

export function APIContents({ child }: { child: DeclarationReflection }) {
  const constructors = getConstructors(child);
  const parameters = getParameters(child);
  const properties = getProperties(child);
  const methods = getMethods(child);

  return (
    <div className="flex flex-col gap-3">
      {constructors && (
        <div>
          <h1 className="mb-3 flex items-center gap-2 p-2 text-xl font-bold tracking-tighter">
            <VscSymbolMethod className="flex-shrink-0" />
            Constructor{constructors.length > 1 ? "s" : ""}
          </h1>
          <ul className="flex flex-col gap-5">
            {constructors.map((constructor) => (
              <li key={constructor.id} className="flex flex-col gap-2">
                {constructor.flags.isOptional || constructor.defaultValue ? (
                  <Badge className="w-fit bg-blue-500/50 hover:bg-blue-500/50">
                    optional
                  </Badge>
                ) : null}
                <p
                  className="font-mono font-semibold"
                  dangerouslySetInnerHTML={{
                    __html: `constructor(${constructor
                      .signatures![0].parameters!.map(
                        (parameter) =>
                          `${parameter.name}${
                            parameter.flags.isOptional || parameter.defaultValue
                              ? "?"
                              : ""
                          }: ${getType(parameter.type!)}`,
                      )
                      .join(", ")}): ${
                      constructor.type ? getType(constructor.type) : child.name
                    }`,
                  }}
                />
                {constructor.signatures?.[0]?.comment?.summary && (
                  <div className="pl-4">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: marked.parse(
                          constructor.signatures[0].comment.summary
                            .map((x) => x.text)
                            .join("\n"),
                        ),
                      }}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {parameters && (
        <div>
          <h1 className="mb-3 flex items-center gap-2 p-2 text-xl font-bold tracking-tighter">
            <VscSymbolParameter className="flex-shrink-0" />
            Parameters
          </h1>
          <ul className="flex flex-col gap-5">
            {parameters.map((parameter) => (
              <li key={parameter.id} className="flex flex-col gap-2">
                {parameter.flags.isOptional || parameter.defaultValue ? (
                  <Badge className="w-fit bg-blue-500/50 hover:bg-blue-500/50">
                    optional
                  </Badge>
                ) : null}
                <div className="flex items-center gap-2 font-mono font-semibold">
                  <p>
                    {parameter.name}
                    {parameter.flags.isOptional || parameter.defaultValue
                      ? "?:"
                      : ":"}
                  </p>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: getType(parameter.type!),
                    }}
                  />
                </div>
                {parameter.comment?.summary && (
                  <div className="pl-4">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: marked.parse(
                          parameter.comment.summary
                            .map((x) => x.text)
                            .join("\n"),
                        ),
                      }}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {properties && (
        <div>
          <h1 className="mb-3 flex items-center gap-2 p-2 text-xl font-bold tracking-tighter">
            <VscSymbolProperty className="flex-shrink-0" />
            Properties
          </h1>
          <ul className="flex flex-col gap-5">
            {properties.map((property) => (
              <li key={property.id} className="flex flex-col gap-2">
                {property.flags.isOptional || property.defaultValue ? (
                  <Badge className="w-fit bg-blue-500/50 hover:bg-blue-500/50">
                    optional
                  </Badge>
                ) : null}
                <div className="flex items-center gap-2 font-mono font-semibold">
                  <p>
                    {property.name}
                    {property.flags.isOptional || property.defaultValue
                      ? "?:"
                      : ":"}
                  </p>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: getType(property.type!),
                    }}
                  />
                </div>
                {property.comment?.summary && (
                  <div className="pl-4">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: marked.parse(
                          property.comment.summary
                            .map((x) => x.text)
                            .join("\n"),
                        ),
                      }}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {methods && (
        <div>
          <h1 className="mb-3 flex items-center gap-2 p-2 text-xl font-bold tracking-tighter">
            <VscSymbolMethod className="flex-shrink-0" />
            Methods
          </h1>
          <ul className="flex flex-col gap-5">
            {methods.map((method) => (
              <li key={method.id} className="flex flex-col gap-2">
                {method.flags.isOptional || method.defaultValue ? (
                  <Badge className="w-fit bg-blue-500/50 hover:bg-blue-500/50">
                    optional
                  </Badge>
                ) : null}
                <p className="font-mono font-semibold">
                  {method.name}(
                  {method
                    .signatures![0].parameters!.map(
                      (parameter) =>
                        `${parameter.name}${
                          parameter.flags.isOptional || parameter.defaultValue
                            ? "?"
                            : ""
                        }: ${getType(parameter.type!, false)}`,
                    )
                    .join(", ")}
                  ): {method.type ? getType(method.type) : child.name}
                </p>
                {method.signatures?.[0]?.comment?.summary && (
                  <div className="pl-4">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: marked.parse(
                          method.signatures[0].comment.summary
                            .map((x) => x.text)
                            .join("\n"),
                        ),
                      }}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
