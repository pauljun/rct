declare namespace Loader {
  declare var NoPage: ReactElement;
  declare var NoData: ReactElement;
  declare var Loading: ReactElement;
  function loadModuleComponent(name: string, exportName?: string): ReactElement;
  function loadBaseComponent(name: string, exportName?: string): ReactElement;
  function loadBusinessComponent(
    name: string,
    exportName?: string
  ): ReactElement;
  function loadUtil(...names: [string]): object;
  function loadScript(name: string, exportName?: string): Promise<object>;
  function loadComponent(
    name: string,
    moduleName?: string,
    exportName?: string
  ): ReactElement;
  function loadDecComponent(options: {
    name: string;
    exportName?: string;
    Component: ReactElement;
    hasArgs: boolean;
    args: [any];
  }): ReactElement;
}
