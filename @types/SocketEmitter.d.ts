import Names from '../src/libs/event/eventName';

declare namespace SocketEmitter {
  declare var events: { [key: string]: any };
  declare var eventName: Names;
  function on(eventName: string, listener: Function, timer?: number): void;
  function emit(eventName, data?: any): void;
}
