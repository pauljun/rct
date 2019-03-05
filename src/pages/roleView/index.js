import React from "react";
import { observer } from "mobx-react";
import { withRouter } from 'react-router-dom';
import Table from "./components/Table";
import Search from "./components/Search";
import { message } from "antd";
import { cloneDeep } from "lodash";
import './style/index.less';

const listarr = Dict.map.common;
const allRouterList = cloneDeep(listarr);
const IconFont = Loader.loadBaseComponent("IconFont");
const WrapperView = Loader.loadBusinessComponent("SystemWrapper");
const ModalComponent = Loader.loadBusinessComponent("ModalComponent");

@withRouter
@Decorator.businessProvider( "roleManagement", "tab", "user")
@Decorator.withEntryLog()
@observer
class RoleView extends React.Component {
  state = {
    list: [],
    total: 10,
    loading: false,
    deleteInfo: "",
    deleteShow: false,
    menuList: []
  };

  async componentWillMount() {
    const { user } = this.props;
    let res = await Service.privilege.queryUserPrivileges(
      user.userInfo.id
    );
    let privs = res.data.module ? res.data.module.concat(res.data.privileges) : [].concat(res.data.privileges);
    let list = [];
    for (let i = 0, l = allRouterList.length; i < l; i++) {
      let item = allRouterList[i];
      let menu = privs.find(
        x => Number(x.id) === item.id || x.privilegeCode === item.id
      );
      if (menu) {
        item.text = menu.menuName || menu.privilegeName;
        list.push(item);
      }
    }
    this.setState({
      menuList: list
    });
    this.search();
    SocketEmitter.on(SocketEmitter.eventName.updateRoleList, this.search);
  }
  componentWillUnmount() {
    SocketEmitter.off(SocketEmitter.eventName.updateRoleList, this.search);
  }

  /**搜索 */
  search = async () => {
    this.setState({
      loading: true
    });
    this.props.roleManagement.queryRoleList().then(res => {
      this.setState({
        total: res.data.total || 0,
        list: res.data.list || res.data,
        loading: false
      });
    });
  };

  /**修改查询条件 */
  editSearchData = options => {
    if (options.roleName) {
      options.pageNum = 1;
    }
    this.props.roleManagement.editSearchData(options).then(res => {
      this.search();
    });
  };
  /**分页切换查询 */
  onChange = (pageNum, pageSize) => {
    this.editSearchData({ pageNum, pageSize });
  };
  /**新增角色 */
  goPage = (moduleName, data) => {
    this.props.tab.goPage({
      moduleName,
      location: this.props.location,
      isUpdate: false,
      data
    });
  };
  /**删除角色 */
  deleteAction(item) {
    this.setState({
      deleteShow: true,
      deleteInfo: item
    });
  }
  deleteOk = () => {
    const { deleteInfo } = this.state;
    Service.role.deleteRole(deleteInfo.id, deleteInfo.roleName).then(res => {
      message.success("角色删除成功");
      this.deleteCancel();
      this.search();
    });
  };
  deleteCancel = () => {
    this.setState({
      deleteShow: false
    });
    SocketEmitter.emit("updateRoleList");
  };
  render() {
    const { roleManagement } = this.props;

    const { searchData } = roleManagement;

    const { list, total, loading, menuList } = this.state;
    return (
      <WrapperView 
        name={'角色管理'} 
        title={<Search
          goPage={this.goPage}
          searchData={searchData}
          onChange={this.editSearchData}
        />}
        >
        <div className="role-view">
          <Table
            key="soldier"
            total={total}
            deleteAction={this.deleteAction.bind(this)}
            searchData={searchData}
            dataSource={list}
            loading={loading}
            onChange={this.onChange}
            menuList={menuList}
            scroll={{ y: "100%" }}
          />
          <ModalComponent
            visible={this.state.deleteShow}
            onOk={this.deleteOk}
            onCancel={this.deleteCancel}
            title="删除确认"
            img="delete"
          >
          <p style={{textAlign:'center',padding:'20px 0'}}> <IconFont type='icon-Delete_Main' style={{fontSize:'64px'}} /></p>
          
            <p style={{ textAlign: "center",paddingBottom:'20px' }}>
              你确定要删除角色{" "}
              <span className="highlight">
                {this.state.deleteInfo.roleName}
              </span>
            </p>
          </ModalComponent>
        </div>
      </WrapperView>
    );
  }
}

export default RoleView;
