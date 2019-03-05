import config from '../config';
const { version, staticResource } = config;

export default {
  videoSurveillanceModule: {
    code: 103900,
    text: '视频监控',
  },
  enterVideoSurveillanceModule: {
    text: '进入视频监控界面',
    code: 103999,
    parent: 103900,
    moduleName: 'videoSurveillance'
  },
  screenShotModule: {
    text: '视频截图',
    code: 103905,
    parent: 103900
  },
  historyAddress: {
    value: `${staticResource}${version}/video/queryHistoryAddress?signature=<signature>&expire=<expire>`,
    label: '获取历史视频地址',
    actionName: 'queryHistoryAddress',
    logInfo: [
      {
        code: 103902,
        parent: 103900,
        text: '查看历史视频'
      }
    ]
  },
  videoCover: {
    value: `${staticResource}${version}/video/LatestCoverMap/<cid>?signature=<signature>&expire=<expire>`,
    label: '获取设备最新的封面图',
    actionName: 'queryLatestCoverMap'
  },
  liveHlsAddress: {
    value: `${staticResource}${version}/video/live.m3u8/<cid>?signature=<signature>&expire=<expire>`,
    label: '获取HLS实时视频地址',
    actionName: 'liveHlsAddress',
    logInfo: [
      {
        code: 103901,
        parent: 103900,
        text: '实时视频'
      }
    ]
  },
  liveFlvAddress: {
    value: `${staticResource}${version}/video/live.flv/<cid>?signature=<signature>&expire=<expire>`,
    label: '获取FLV实时视频地址',
    actionName: 'liveFlvAddress',
    logInfo: [
      {
        code: 103901,
        parent: 103900,
        text: '实时视频'
      }
    ]
  },
  downloadAddress: {
    value: `${staticResource}${version}/video/record/ts/<cid>/<fileName>?beginTime=<beginTime>&endTime=<endTime>&signature=<signature>&expire=<expire>`,
    label: '获取设备录像TS下载地址',
    actionName: 'queryTSDownLoadAddress'
  },
  addPreset: {
    value: `${staticResource}${version}/preset/addPreset`,
    label: '添加预置点',
    actionName: 'addPreset'
  },
  deletePreset: {
    value: `${staticResource}${version}/preset/deletePreset`,
    label: '删除预置点',
    actionName: 'deletePreset'
  },
  queryPresets: {
    value: `${staticResource}${version}/preset/queryPresets`,
    label: '获取设备的预置点列表',
    actionName: 'queryPresets'
  },
  controlGBPTZ: {
    value: `${staticResource}${version}/ptz/controlGBPTZ`,
    label: '国标控制云台转动',
    actionName: 'controlCamera'
  },
  controlPTZ: {
    value: `${staticResource}${version}/ptz/controlPTZ`,
    label: '控制云台转动',
    actionName: 'controlCamera'
  },
  videoAbstract: {
    value: `${staticResource}${version}/summary/video`,
    label: '视频摘要',
    actionName: 'videoAbstract'
  },
};
