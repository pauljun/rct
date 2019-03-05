import Config from '../../config';
const { api, version } = Config;

export default {
	bodyLibModule: {
    code: 104200,
    text: '人体图库'
  },
  enterBodyLibModule: {
    text: '进入人体图库界面',
    code: 104299,
    parent: 104200,
    moduleName: 'bodyLibrary',
  },
  bodies: {
    value: `${api}disa/${version}/body/bodies/<id>`,
    label: '根据抓拍图片记录id查询人体详情',
    actionName: 'bodies',
  },
  countBodies: {
    value: `${api}disa/${version}/body/countBodies`,
    label: '人体总数查询',
    actionName: 'countBodies',
  },
  getFeature: {
    value: `${api}disa/${version}/body/getFeature`,
    label: '人体特征值提取',
    actionName: 'getBodyFeature',
  },
  queryBodies: {
    value: `${api}disa/${version}/body/queryBodies`,
    label: '人体列表查询',
    actionName: 'queryBodies',
  },
  queryBodiesByFeature: {
    value: `${api}disa/${version}/body/queryBodiesByFeature`,
    label: '根据人体特征查询人体列表',
    actionName: 'queryBodiesByFeature',
  },
  queryBodiesViolence: {
    value: `${api}disa/${version}/body/queryBodiesViolence`,
    label: '人体暴力比对查询',
    logInfo: [{
      code: 105702,
      parent: 105700,
      text: '人体照片以图搜图',
    }],
    actionName: 'queryBodiesViolence',
  }
}