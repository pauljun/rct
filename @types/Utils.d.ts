declare namespace Utils {
  function arrayFill(length: number, fill: any): [any];

  function arraySlice(
    dataList: [any],
    currentPage: number,
    size: number
  ): [any];

  function arraySliceForX(dataList: [any], x: number): [[any]];

  function getCache(key: string, type: string): any;

  function setCache(key: string, value: any, type: string): void;

  function getUserCache(key: string, type: string): any;

  function setUserCache(key: string, value: string, type: string): void;

  function getPosition(ele: HTMLElement): Object<{ left: number; top: number }>;

  function stopPropagation(e: MouseEvent): void;

  function animateFly(
    start: Object<{ clientX: number; clientY: number }>,
    url: string,
    speed: number,
    target: HTMLElement,
    posFix: Object<{ top: number; left: number }>
  ): void;

  function tagAToDownload(
    options: Object<{ url: string; title: string; target: string }>
  ): void;

  function fullscreen(element: HTMLElement): void;

  function exitFullscreen(): void;

  function fullscreenEnabled(): boolean;

  function isFullscreen(): HTMLElement | boolean;

  function fullScreenListener(isAdd: boolean, fullscreenchange: Function): void;

  function downloadLocalImage(imgUrl: string, title: string): void;

  function urlToBase64(
    options: Object<{
      imgUrl: string;
      imgQuality: number;
      width: number;
      height: number;
    }>,
    callback: Function
  );

  function drawImage(
    options: Object<{
      target: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement;
      width: number;
      height: number;
      imgType: string;
      imgQuality: number;
    }>
  );

  function addWaterMark(
    canvas: HTMLCanvasElement,
    waterMark: Object<any>
  ): void;

  function fileToBase64(file: File, callback: Function): void;

  function base64ToBlob(base64Url: string): Blob;

  function loadImage(
    imgUrl: string,
    noAjax: boolean
  ): Promise<HTMLImageElement>;

  function isEqual(objValue: Object<any>, othValue: Object<any>): Boolean;

  function toMoney(num: number): string;

  function getSubStr(str: string, number: number): string;

  function catchPromise(fn: Promise<any>): Promise<any>;

  function queryFormat(str: string): Object<any>;

  function escapeUrl(url: string, isEscape: boolean): string;

  function isCrosUrl(url: string): boolean;

  function computTreeList(
    list: [any],
    id: string,
    pid: string,
    isNoDeep: boolean
  );

  function judgeType(data: object, type: string): boolean;

  function uuid(): string;

  function createTextImage(options: Object<any>): Promise<HTMLCanvasElement>;

  function createImageWaterMark(
    path: string,
    options: Object<any>
  ): Promise<string>;
}
