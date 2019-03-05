declare namespace AuthConfig {
  declare var menu: Array<{
    id: string;
    code: string;
    name: string;
    isHide?: boolean;
    icon: string;
    title: string;
    storeName?: [string];
    parentId?: string;
    includeNames?: [string];
    menuName?: [string];
  }>;
  declare var func: Array<{
    id: string;
    code: string;
    name: string;
    icon?: string;
    title: string;
  }>;
}
