import { Application } from "typedoc";

const createVirtualModule = async () => {
  const typedocApp = await Application.bootstrap({
    entryPoints: ["../packages/scizor/src/index.ts"],
  });
  const project = await typedocApp.convert();
  const data = typedocApp.serializer.projectToObject(project!, process.cwd());
  return `
export const project = ${JSON.stringify(data)};
`;
};

export const typedocPlugin = () => {
  const virtualModuleId = "virtual:typedoc";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "typedoc-plugin",
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return createVirtualModule();
      }
    },
  };
};
