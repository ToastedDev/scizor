import { Application, Serializer } from "typedoc";

const createVirtualModule = async () => {
  const typedocApp = await Application.bootstrap({
    entryPoints: ["../packages/scizor/src/index.ts"],
  });
  const serializer = new Serializer();
  const projectDir = await typedocApp.convert();
  const project = serializer.projectToObject(projectDir!, process.cwd());
  return `
export const project = ${JSON.stringify(project)};
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
