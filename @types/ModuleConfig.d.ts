declare var ModuleConfig: {
  [key: string]: {
    input?: string;
    output: string;
    url?: string;
    name?: string;
    isLibrary?: boolean;
    isBaseComponent?: boolean;
    isBusinessComponent?: boolean;
    isPage?:boolean
  };
  // isLibrary 标记改配置是一个第三方的库
  // isBaseComponent 标记改配置是一个基础组件
  // isBusinessComponent 标记改配置是一个业务组件
  // isLibrary isBaseComponent isBusinessComponent 固定后不回经常变动 所以中任意一个为true时都不会在 compile all 时编译
  // compile baseComponent 只会编译所有isBaseComponent为true的配置，isBusinessComponent同理
};
