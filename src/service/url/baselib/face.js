import Config from '../../config';
const { api, version } = Config;

export default {
  faceLibModule: {
		code: 104100,
		text: '人脸图库'
  },
  enterFaceLibModule: {
    text: '进入人脸图库界面',
    code: 104199,
    parent: 104100,
    moduleName: 'faceLibrary',
  },
  faceDetailModule: {
    code: 104105,
    parent: 104100,
    text: '查看人脸抓拍照片',
  },
  countFaces: {
    value: `${api}disa/${version}/face/countFaces`,
    label: '人脸图库总数',
    actionName: 'countFaces',
  },
  faces: {
    value: `${api}disa/${version}/face/faces/<id>`,
    label: '根据抓拍图片ID查询人脸详情',
    actionName: 'faces'
  },
  getFeature: {
    value: `${api}disa/${version}/face/getFeature`,
    label: 'Url人脸特征值提取',
    actionName: 'getFeature',
  },
  uploadImg: {
    value: `${api}disa/${version}/face/img/uploadImg`,
    label: '上传图片供以图搜图使用',
    actionName: 'disaUploadImg'
  },
  persons: {
    value: `${api}disa/${version}/face/persons/<id>`,
    label: '根据抓拍图片ID查询图片详情',
    actionName: 'persons'
  },
  queryFaces: {
    value: `${api}disa/${version}/face/queryFaces`,
    label: '人脸图库列表',
    actionName: 'queryFaces',
  },
  queryFacesByFeature: {
    value: `${api}disa/${version}/face/queryFacesByFeature`,
    label: '根据人脸特征查询人脸列表',
    logInfo: [{
      code: 105701,
      parent: 105700,
      text: '人脸照片以图搜图',
    }],
    actionName: 'queryFacesByFeature',
  },
  queryFacesViolence: {
    value: `${api}disa/${version}/face/queryFacesViolence`,
    label: '人脸暴力比对查询',
    actionName: 'queryFacesViolence'
  },
  queryLowFaces: {
    value: `${api}disa/${version}/face/queryLowFaces`,
    label: '低质量图库人脸以图搜图',
    actionName: 'queryLowFaces'
  },
  queryNoFeaturePicture: {
    value: `${api}disa/${version}/face/queryNoFeaturePicture`,
    label: '无特征值列表查询',
    actionName: 'queryNoFeaturePicture'
  },
  countPerson: {
    value: `${api}disa/${version}/statistics/countPerson`,
    label: '资源总数统计',
    actionName: 'countPerson'
  },
  countPersonDayTrend: {
    value: `${api}disa/${version}/statistics/countPersonDayTrend`,
    label: '按天统计资源走势',
    actionName: 'countPersonDayTrend'
  },
  countPersonHourTrend: {
    value: `${api}disa/${version}/statistics/countPersonHourTrend`,
    label: '按小时统计资源走势',
    actionName: 'countPersonHourTrend'
  }
}