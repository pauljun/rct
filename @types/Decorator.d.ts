declare namespace Decorator {
  function readonly(
    target: object,
    name: string,
    descriptor: PropertyDescriptor
  ): object;

  function unenumerable(
    target: object,
    name: string,
    descriptor: PropertyDescriptor
  ): object;

  function errorBoundary(Component: object): ReactElement;
  function businessProvider(
    ...storeNames: [string]
  ): (Component: object) => ReactElement;
  function shouldComponentUpdate(Component: object): ReactElement;
  function withUtil(...names: [string]): (Component: object) => ReactElement;

  function withActionPanel(options: {
    condition?: string;
    names: [string];
  }): (Component: object) => ReactElement;
}
