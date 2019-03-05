import config from '../config';
const { api, version } = config;
//人员档案url
export default {
  addPerson: {
    value: `${api}person/${version}/person/addPerson`,
    label: '新增实有人员',
    actionName: 'addPerson'
  },
  importPersons: {
    value: `${api}person/${version}/person/importPersons`,
    label: '批量导入实有人员信息',
    actionName: 'importPersons'
  },
  deletePerson: {
    value: `${api}person/${version}/person/deletePerson/<id>`,
    label: '删除单个实有人员',
    actionName: 'deletePerson'
  },
  deletePersons: {
    value: `${api}person/${version}/person/deletePersons`,
    label: '批量删除实有人员',
    actionName: 'deletePersons'
  },
  updatePerson: {
    value: `${api}person/${version}/person/updatePerson`,
    label: '修改实有人员信息',
    actionName: 'updatePerson'
  },
  searchPersonByKeywords: {
    value: `${api}person/${version}/person/searchPersonByKeywords`,
    label: '根据关键字返回推荐信息',
    actionName: 'searchPersonByKeywords'
  },
  queryPersons: {
    // value: `${api}person/${version}/person/queryPersons`,
    value: `${api}person/${version}/person/queryPersons`,
    label: '根据条件查询人员',
    actionName: 'queryPersons'
  },
  uploadPersonPicture: {
    value: `${api}person/${version}/upload/uploadPersonPicture`,
    label: '人员档案上传图片搜索',
    actionName: 'queryPersons'
  },
  getPersonById: {
    value: `${api}person/${version}/person/getPersonById`,
    label: '获取人员基本信息',
    actionName: 'getPersonById'
  },
  getPersonIdentityCardNumber: {
    value: `${api}person/${version}/person/getPersonIdentityCardNumber`,
    label: '查询实有人员的证件号码',
    actionName: 'getPersonIdentityCardNumber'
  },
  getPersonMobile: {
    value: `${api}person/${version}/person/getPersonMobile`,
    label: '查询实有人员的手机号码',
    actionName: 'getPersonMobile'
  },
  getPersonDetailAppearance: {
    value: `${api}person/${version}/person/getPersonDetailAppearance`,
    label: '查询单个人员各种外观类型下具体的标签及出现次数',
    actionName: 'getPersonDetailAppearance'
  },
  getPersonFrequentedPlaces: {
    value: `${api}person/${version}/person/getPersonFrequentedPlaces`,
    label: '获取单个人员常去地及在常去地出现的次数',
    actionName: 'getPersonFrequentedPlaces'
  },
  getPersonAccessRecords: {
    value: `${api}person/${version}/person/getPersonAccessRecords`,
    label: '获取实有人员门禁记录',
    actionName: 'getPersonAccessRecords'
  },
  getPersonRoommates: {
    value: `${api}person/${version}/person/getPersonRoommates`,
    label: '获取实有人员同屋关系',
    actionName: 'getPersonRoommates'
  },
  getPersonAccompanies: {
    value: `${api}person/${version}/person/getPersonAccompanies`,
    label: '获取单个人员的同行关系',
    actionName: 'getPersonAccompanies'
  },
  querySimilarVids: {
    value: `${api}person/${version}/person/querySimilarVids`,
    label: '获取人员相似的AID',
    actionName: 'querySimilarVids'
  },
  getDetailAccompany: {
    value: `${api}person/${version}/person/getDetailAccompany`,
    label: '获取两个人员的详细同行信息',
    actionName: 'getDetailAccompany'
  },
  queryTravelRuleInOneDay: {
    value: `${api}person/${version}/person/queryTravelRuleInOneDay`,
    label: '获取人员指定时间范围内一天各个时间段的出行规律以及平均一天出行规律',
    actionName: 'queryTravelRuleInOneDay'
  },
  queryTravelRuleByDay: {
    value: `${api}person/${version}/person/queryTravelRuleByDay`,
    label: '获取人员按天统计的出行规律',
    actionName: 'queryTravelRuleByDay'
  },
  queryAverageTravelRule: {
    value: `${api}person/${version}/person/queryAverageTravelRule`,
    label: '获取人员每星期或每月的平均出行规律',
    actionName: 'queryAverageTravelRule'
  },
  queryFootholds: {
    value: `${api}person/${version}/person/queryFootholds`,
    label: '获取人员的落脚点信息',
    actionName: 'queryFootholds'
  },
  queryRecentAppearance: {
    value: `${api}person/${version}/person/queryRecentAppearance`,
    label: '获取人员最近出现时间/最近出现地点',
    actionName: 'queryRecentAppearance'
  },
  queryFirstAppearance: {
    value: `${api}person/${version}/person/queryFirstAppearance`,
    label: '获取人员首次出现时间/首次出现地点',
    actionName: 'queryFirstAppearance'
  },
  getAidsPicture: {
    value: `${api}person/${version}/person/getAidsPicture`,
    label: '获取多个AID人员的照片信息',
    actionName: 'getAidsPicture' 
  },
  addTags: {
    value: `${api}person/${version}/person/addTags`,
    label: '给人员打标签',
    actionName: 'addTags'
  },
  queryPersonTags: {
    value: `${api}person/${version}/person/queryPersonTags`,
    label: '获取人员标签',
    actionName: 'queryPersonTags'
  },
  setOrCancelFocus: {
    value: `${api}person/${version}/person/setOrCancelFocus`,
    label: '设置/取消人员关注',
    actionName: 'setOrCancelFocus'
  },
  getFocusInfos: {
    value: `${api}person/${version}/person/getFocusInfos`,
    label: '获取人员关注状态',
    actionName: 'getFocusInfos'
  },
  queryRelationVids: {
    value: `${api}person/${version}/person/queryRelationVids`,
    label: '查询人员已关联到的AID列表',
    actionName: 'queryRelationVids'
  },
  addRelationVids: {
    value: `${api}person/${version}/person/addRelationVids`,
    label: '设置人员关联AID',
    actionName: 'addRelationVids'
  },
  uploadPersonsFile: {
    value: `${api}person/${version}/upload/uploadPersonsFile`,
    label: '实有人员批量导入文件上传',
    actionName: 'uploadPersonsFile'
  },
  listCommunityPersons: {
    value: `${api}person/${version}/person/listCommunityPersons`,
    label: '查询实有人员信息',
    actionName: 'listCommunityPersons'
  },
  getPersonCount: {
    value: `${api}person/${version}/person/getPersonCount`,
    label: '获取用户权限下的人员档案中的人员数',
    actionName: 'getPersonCount'
  },
  queryAidDetail: {
    value: `${api}disa/${version}/aid/queryAidDetail`,
    label: '查询虚拟人员对应详情的参数',
    actionName: 'queryAidDetail'
  },
  queryRecentAppearanceByAids: {
    value: `${api}person/${version}/person/queryRecentAppearanceByAids`,
    label: '通过aid查询是否有绑定personId',
    actionName: 'queryRecentAppearanceByAids'
  },
};
