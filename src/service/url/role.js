import config from '../config';
const { api,version } = config;
export default {
  roleModule: {
		code: 104500,
		text: '角色管理',
  },
  enterRoleModule: {
    text: '进入角色管理界面',
    code: 104599,
    parent: 104500,
    moduleName: 'roleView',
  },
	queryRoleList: {
		value: `${api}user/role/${version}/queryRoles`,
		label: '角色列表',
	},
	roleDetail: {
		value: `${api}user/role/${version}/roles/<id>`,
		label: '角色详情',
		logInfo: [
			{
				code: 104501,
				parent: 104500,
				text: '查看角色信息'
			}
		]
	},
	addRole: {
		value: `${api}user/role/${version}/addRole`,
		label: '新增角色',
		logInfo: [
			{
				code: 104502,
				parent: 104500,
				text: '新增角色'
			}
		]
	},
	changeRole: {
		value: `${api}user/role/${version}/changeRole`,
		label: '编辑角色',
		logInfo: [
			{
				code: 104503,
				parent: 104500,
				text: '编辑角色'
			}
		]
	},
	deleteRole: {
		value: `${api}user/role/${version}/deleteRole/<id>`,
		label: '删除角色',
		logInfo: [
			{
				code: 104504,
				parent: 104500,
				text: '删除角色'
			}
		]
	}
};
