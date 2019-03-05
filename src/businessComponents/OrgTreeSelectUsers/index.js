/* 
  组件：从组织树选择有权限的用户
  参数：
  className: 添加的类名
  defaultSelectList： 默认选中用户id集合（[string,string]）
  onChange: 选中列表改变事件
  andOr: 调用接口得到用户权限  1(默认) 且 2 或
  privilegeName： 权限名称 默认空[]---不受权限限制
*/
import React from 'react';
import { inject } from 'mobx-react';
import { toJS } from 'mobx';
import * as _ from 'lodash';
import './index.less';
// const OrgSelectTreeComponent = Loader.loadComponent('OrgSelectTree');
const OrgTree = Loader.loadBusinessComponent('OrgTree');
const ListComponent = Loader.loadComponent('ListComponent');
const IconFont = Loader.loadBaseComponent('IconFont')

@inject('organization', 'menu')
class OrgTreeSelectUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectOrgId: null, // 选中组织的id
      selectUserList: [], // 已选用户集合
    };
  }


  componentWillMount() {
    // 请求接口，拿到有权限的用户列表
    const { andOr = 1, privilegeName = [], organization, defaultSelectUser=[]} = this.props;
    // 组织结构处理
    const orgList = organization.orgArray;
    this.listOrg = Utils.computTreeList(_.cloneDeep(toJS(orgList))) || [{}];
    const selectOrgId = this.listOrg[0].id;
    this.setState({
      selectOrgId // 默认选中第一级组织
    });
    // 权限处理
    let privilegeIds = []
    if(privilegeName.length > 0){
      for(let i = 0; i < privilegeName.length; i++){
        const menuInfo = AuthConfig.func.find(item => privilegeName[i] === item.name)
        if(menuInfo){
          privilegeIds.push(menuInfo.id)
        }
      }
    }
    // 请求接口，拿到有权限的用户列表
    Service.user.queryPrivilegeUsers({
      privilegeIds,
      andOr
    }).then(res => {
      // res为有权限的所有用户-----根据单一数组id筛选对应的整个用户详情
      this.userList = res.data || []
      this.forceUpdate()
      if(defaultSelectUser.length === 0){
        return
      }
      let selectUserList = res.data.filter(item => {
        if(~defaultSelectUser.indexOf(item.id)){
          return true
        }
      })
      if (selectUserList && selectUserList.length) {
        this.setState({ selectUserList });
      }
    })
  }

  // 组织树选中事件
  handleSelectOrg = item => {
    this.setState({ selectOrgId: item[0] });
  };

   // 根据组织去筛选组织下的有权限的用户
   computedList = org => {
    let arr = this.userList || [] // 所有有权限用户集合
    if (!!org) {
      let orgIds = this.props.organization.queryOrgIdsForParentOrgId(org);
      arr = arr.filter(item => orgIds.indexOf(item.organizationId) > -1 );
    }
    return arr
   }

  selectUsers = ({ item, flag, changeAll, list }) => {
    let { selectUserList } = this.state;
    if (flag) {
      !changeAll
        ? selectUserList.push(item)
        : (selectUserList = [].concat(selectUserList, list));
    } else {
      if (changeAll) {
        selectUserList = _.differenceBy(selectUserList, list, 'id');
      } else {
        _.remove(selectUserList, v => v.id === item.id);
      }
    }
    selectUserList = _.uniqBy(selectUserList, 'id');
    this.setState({
      selectUserList
    }, () => {
      this.props.onChange && this.props.onChange(selectUserList);
    })
  }

  render() {
    const {
      className = ''
    } = this.props;
    const { selectOrgId, selectUserList } = this.state;
    let orgUserList = this.computedList(selectOrgId) || [];
    return (
      <div className={`org-select-user-wrapper ${className}`}>
        <OrgTree hasTitle={true} hasSearch={true} onSelect={this.handleSelectOrg} />
        <ListComponent 
           hasTitle={true}
           checkable={true}
           hasSearch={true}
           hasCheckAll={true}
           icon={<IconFont type={'icon-UserName_Light'} className='user-icon-cla'/>}
           listData={orgUserList}
           selectList={selectUserList}
           onChange={this.selectUsers}
           className='user-all-list'
           title="人员"
        />
        <ListComponent 
           hasTitle={true}
           hasClear={true}
           listData={selectUserList}
           onChange={this.selectUsers}
           icon={<IconFont type={'icon-UserName_Light'} className='user-icon-cla'/>}
           className='user-selected-list'
           title={`已添加人员(${selectUserList.length}个)`}
        />
      </div>
    );
  }
}
export default OrgTreeSelectUser
