import React from "react";
import { Button ,message,Form,Select} from "antd";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import UserTable from "./components/Table.js";
import SearchOrg from "./components/Search.js";

import './index.less';

const WrapperView = Loader.loadBusinessComponent("SystemWrapper");
const BreadCrumb = Loader.loadBaseComponent("BreadCrumb");
const AuthComponent = Loader.loadBusinessComponent("AuthComponent");
const Search=Loader.loadBaseComponent('SearchInput');

@withRouter
@Decorator.businessProvider(
  "organization",
  "userManagement",
  "tab",
  "roleManagement",
  "menu"
)
@Decorator.withEntryLog()
@observer
class UserView extends React.Component {
  state = {
    list: [],
    loading: false,
    ifInclude: 0, // 是否包含子组织
    roleList: [],
    clickedOrgInfo: null,
    selectedRowKeys: [],
    selectedRows: null
  };
  componentWillMount() {
    const { userManagement } = this.props;
    userManagement.initData();
  }
  componentDidMount() {
    SocketEmitter.on("UPDATE_OrgTree_LIST", this.updateOrgTreeList);
  }
  componentWillUnmount() {
    SocketEmitter.off("UPDATE_OrgTree_LIST", this.updateOrgTreeList);
  }

  /**
   * 监听组织更新
  */
  updateOrgTreeList = (dataInfo, type = "emitEvent") => {
    this.leafClk([dataInfo.organizationId], type);
  };

  /**子节点点击事件 */
  leafClk = (key, type) => {
    if (!key || !key.length) {
      return;
    }
    const { userManagement, organization } = this.props;
    const parentOrgList = organization.getParentOrgListByOrgId(key[0]);
    const infoByOrgId = parentOrgList[0];
    if (type && type === "emitEvent") {
      let expandkeys = parentOrgList.map(v => v.id);
      const arr = expandkeys.filter(v => v !== key[0]);
      this.orgTree.onExpand(arr);
    }
    userManagement.setData({
      activeKey: key
    });
    this.getUserList();
    this.setState({
      clickedOrgInfo: infoByOrgId ? infoByOrgId.id : ""
    });
  };

  /**查询 */
  getUserList = () => {
    const { roleManagement,userManagement } = this.props;
    this.setState({ loading: true });
    let options = {}
    let listNew = []

    let searchData=userManagement.searchData
    searchData.organizationId = userManagement.activeKey[0]
    Promise.all([
      roleManagement.queryRoleList(),
      Service.user.queryUsers(searchData)
    ]).then((resArr) => {
      this.setState({ 
        roleList: resArr[0].data.list&&resArr[0].data.list,
        list: resArr[1].data.list&&resArr[1].data.list,
        total: resArr[1].data.total&&resArr[1].data.total,
        loading: false
      },() => {
        const userIds = this.state.list.map(v => v.id)
        let promiseList= this.state.list.map(v => 
          Service.user.queryUserRoles({userId: v.id})
        )
       if(this.state.list.length){
         promiseList.push( Service.user.getIdentityCard(userIds),Service.user.getMobile(userIds))
          Promise.all(
            promiseList
          ).then(results => {
            const identityCardNums = results[results.length-2].data;
            const phoneNums = results[results.length-1].data;
            let list = this.state.list
            list.map((v,k) => {
              const idCardItem = identityCardNums.find(x => x.id === v.id);
              const PhoneItem = phoneNums.find(p => p.id === v.id);
              options = Object.assign({} , v , {
                roleName:results[k].data[0].roleName,
                identityCardNum: idCardItem.identityCardNum,
                phoneNum: PhoneItem.mobile
              })
              listNew.push(options)
              })
              this.setState({
                list:listNew
              })
          })
       }
      });
    })
  };
  /**删除弹窗确定 */
  deleteOk = item => {
    return Service.user.deleteUser(item).then(() => {
      this.getUserList();
      return Promise.resolve();
    }).catch(err => {
      message.error(err.data&&err.data.message);
      return Promise.reject()
    });
  };

  /** 包含子组织*/
  changeSearchData = ({ value }) => {
    this.setState({
      ifInclude: value
    });
    this.editSearchData({ containSubOrganization : value });
  };
  /** 查询条件改变并查询*/
  editSearchData = options => {
    this.props.userManagement.editSearchData(options).then(this.getUserList);
  };
  /**分页切换查询 */
  onPageChange = (pageNum, pageSize) => {
    this.editSearchData({
      limit:pageSize,
      offset:(pageNum-1)*pageSize
    });
  };
  keyWordsSearch = searchFilter => {
    this.editSearchData({
      keywords:searchFilter,
      offset:0
    });
  };
  /**新增用户 */
  goPage = ({ moduleName, state }) => {
    this.props.tab.goPage({
      moduleName,
      location: this.props.location,
      isUpdate: false,
      state
    });
  };
  handleAddUser = () => {
    this.goPage({
      moduleName: "userModify",
      state: {
        orgId: this.state.clickedOrgInfo
      }
    });
  };
  changeStatus = item => {
    Service.user
      .changeUserStatus( item.id, item.validState == 104406 ? 104405 : 104406 , item.realName )
      .then(this.getUserList);
  };
  /** 批量删除操作*/
  deleteGroup = () => {
    const { selectedRowKeys, selectedRows } = this.state;
    this.deleteGroupInfo.deleteGroup(selectedRowKeys, selectedRows);
  };
  render() {
    const { organization, userManagement } = this.props;
    let {
      list,
      total,
      loading,
      ifInclude,
      roleList,
    } = this.state;
    const { searchData, activeKey } = userManagement;
    const BreadcrumbList = organization.getParentOrgListByOrgId(activeKey[0]).reverse();
    return (
      <WrapperView
        allowClear={true}
        treeActiveKey={activeKey}
        leafClk={this.leafClk}
        viewRef={orgTree => (this.orgTree = orgTree)}
        Treetitle="用户管理"
        TreeChildren={
          <SearchOrg
            changeSearchData={this.changeSearchData}
            ifInclude={ifInclude}
        />
        }
        leftOrgTree={true}
        className="user-setting-wrapper"
        breadCrumb={activeKey && <BreadCrumb list={BreadcrumbList} />}
      >
        <div className="user-content">
          <div className="user-Search-Btns">
            <div className='user-search-container'>
              <AuthComponent actionName="userModify">
                <Button
                  type ='primary'
                  onClick={this.handleAddUser}
                  icon="plus"
                  className="orange-btn setting-user-add"
                >新建用户</Button>
              </AuthComponent>
              <FormGroupLayout
                className='user-filters'
                roleList={roleList}
                getUserList={this.getUserList}
              />
            </div>
              <Search
                placeholder="请输入用户名或手机号查询"
                style={{ width: "250px" }}
                enterButton
                onChange={this.keyWordsSearch}
              />
          </div>
          <UserTable
            deleteRef={deleteGroup => {
              this.deleteGroupInfo = deleteGroup;
            }}
            className="user-content-table"
            deleteOk={this.deleteOk}
            dataSource={list}
            loading={loading}
            total={total}
            searchData={searchData}
            onChange={this.onPageChange}
            changeStatus={this.changeStatus}
            scroll={{ y: "100%" }}
            roleList={roleList}
            goPage={this.goPage}
          />
        </div>
      </WrapperView>
    );
  }
}


const FormItem = Form.Item;
const Option = Select.Option;
const userStatus=[
  {
    value:"-1",
    label:"全部"
  },
  {
    value:104406,
    label:"开启"
  },
  {
    value:104406,
    label:"关闭"
  },
]
@withRouter
@Decorator.businessProvider('userManagement')
@observer
@Form.create({
  onFieldsChange: (props, files) => {
    const { userManagement } = props;
    let data = {};
    Object.keys(files).map(key => {
      data[key] = files[key].value;
    });
    userManagement.editSearchData(data)
    props.getUserList()
  }
})
class FormGroupLayout extends React.Component {
  render() {
    const { form,roleList,className=''} = this.props;
    const { getFieldDecorator } = form;
    roleList.unshift({
      id:"-1",
      roleName:'全部角色'
    })
    return (
      <Form layout="inline" className={className}>
        <FormItem>
          {getFieldDecorator('userRoles')(
            <Select placeholder="全部角色"
            >
              {roleList&&roleList.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.roleName}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('userStatus')(
            <Select placeholder="全部状态"
            > 
              {userStatus&&userStatus.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
       
      </Form>
    );
  }
}
export default UserView;
