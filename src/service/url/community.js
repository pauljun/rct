import Config from "../config";
const { api, version } = Config;

export default {
  comEntryModule: {
    code: 106700,
    text: "社区管理"
  },
  enterComEntryModule: {
    code: 106799,
    parent: 106700,
    text: "进入社区管理界面",
    moduleName: "communityOverview"
  },
  comResdModule: {
    code: 106800,
    text: "登记人员管理"
  },
  enterComResdModule: {
    code: 106899,
    parent: 106800,
    text: "进入登记人员管理界面",
    moduleName: "communityRegistered"
  },
  comFlowModule: {
    code: 106900,
    text: "未登记人员管理"
  },
  enterComFlowModule: {
    code: 106999,
    parent: 106900,
    text: "进入未登记人员管理界面",
    moduleName: "communityUnRegistered"
  },
  // 小区
  statisticsList: {
    value: `${api}community/${version}/statisticsList`,
    label: "社区总览列表",
    actionName: "statisticsList"
  },
  queryRegisteredPeople: {
    value: `${api}community/${version}/queryRegisteredPeople`,
    label: "常住人口列表查询",
    actionName: "queryRegisteredPeople",
    logInfo: [
			{
				code: 106801,
				parent: 106800,
				text: '查询已登记人口信息'
			}
		]
  },
  queryUnregisteredPeople: {
    value: `${api}community/${version}/queryUnregisteredPeople`,
    label: "流动人口列表查询",
    actionName: "queryUnregisteredPeople",
    logInfo: [
			{
				code: 106901,
				parent: 106900,
				text: '查询未登记人口信息'
			}
		]
  },
  updatePeopleFocus: {
    value: `${api}community/${version}/updatePeopleFocus`,
    label: "添加取消关注",
    actionName: "updatePeopleFocus"
  },
  uploadVillageImg: {
    value: `${api}community/${version}/uploadVillageImg`,
    label: "上传小区形象图片"
  },
  addVillage: {
    value: `${api}community/${version}/village/addVillage`,
    label: "添加小区"
  },
  assignDevice: {
    value: `${api}community/${version}/village/assignDevice`,
    label: "给小区分配设备"
  },
  assignedDevice: {
    value: `${api}community/${version}/village/assignedDevice`,
    label: "小区已分配设备列表"
  },
  assignViillage: {
    value: `${api}community/${version}/village/assignViillage`,
    label: "给小区移动组织归属"
  },
  deleteVillage: {
    value: `${api}community/${version}/village/deleteVillage/<id>`,
    label: "删除小区"
  },
  queryVillages: {
    value: `${api}community/${version}/village/queryVillages`,
    label: "获取小区列表"
  },
  resetVillage: {
    value: `${api}community/${version}/village/resetVillage/<id>`,
    label: "重置小区"
  },
  updateVillage: {
    value: `${api}community/${version}/village/updateVillage`,
    label: "编辑小区基本信息"
  },
  villageDetail: {
    value: `${api}community/${version}/village/villages/<id>`,
    label: "小区详情"
  },
  countVillagePeople: {
    value: `${api}community/${version}/countVillagePeople`,
    label: "小区人员统计"
  },
  countVillageDevice: {
    value: `${api}community/${version}/countVillageDevice`,
    label: "小区设备统计"
  },
  countVillageResource: {
    value: `${api}community/${version}/countVillageResource`,
    label: "小区数据资源统计(人脸/人体/机动车)"
  },
  countFace: {
    value: `${api}community/${version}/countFace`,
    label: "获取社区7天人脸抓拍数"
  },
  queryWaitingBindAids: {
    value: `${api}community/${version}/people/queryWaitingBindAids`,
    label: "绑定aid列表查询"
  }
};
