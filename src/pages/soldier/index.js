import React from 'react';
import { message, Button } from 'antd';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Table from './components/Table';
import SoldierModal from './components/SoldierModal';
import Title from './components/Title';
import SearchView from './components/SearchView';
import './index.less';
import { cloneDeep } from "lodash";
import { async } from 'q';

const WrapperView = Loader.loadBusinessComponent('SystemWrapper');
const AuthComponent = Loader.loadBusinessComponent("AuthComponent");

@withRouter
@Decorator.withEntryLog()
@Decorator.businessProvider('organization','soldier','user')
@observer
class Soldier extends React.Component {
  state = {
    list: [],
    total: 10,
    loading: false,
    // 弹窗
    modalVisible: false,
    content: 1, // 1: 解绑弹窗， 2: 编辑弹窗, 3: 添加弹窗
    
    // 编辑单兵弹窗
    firstClick: true,
    confirmLoading: false,
    isEdit: false,
    editItem: {}, // 编辑单兵时单个单兵信息
    userList: [], // 右侧用户列表
    selectUser: null, // 右侧选中用户信息
    activeOrgIds:[], // 左侧选中组织的id集合


    //解除绑定信息
    unbindInfo:'',

    //包含子组织
    ifInclude:'exclusive',

    //弹窗组织信息
    //批量解除绑定
    selectedRowKeys:[],
    selectedRows:null
  };

  componentDidMount() {
    const { user, soldier} = this.props;
    soldier.initData()
    soldier.editSearchData({
      operationCenterId: user.userInfo.operationCenterId
    })
    this.handleSearch(true);
  }
  /**
   * 搜索 参数为true 则从第一页开始搜索
   * @param {Boolean} resetPage
   */
  handleSearch = async (resetPage) => {
    const { soldier} = this.props;
    const searchData = soldier.searchData
    if(resetPage) {
      await soldier.editSearchData({ offset:0});
    }
    this.setState({ loading: true });
    const result = await Service.soldier.queryLiquerySolosDevice(cloneDeep(searchData)).then(res => res && res.data);
    this.setState({
      total: result&&result.total,
      list: result&&result.list,
      loading: false
    });
  };

  /**
   * 修改查询条件
   */
  editSearchData = (options, resetPage=true) => {
    const { soldier } = this.props;
    soldier.editSearchData(options).then(() => {
      this.handleSearch(resetPage);
    })
  };

  /**
   * 分页切换查询
   */
  handlePageChange = (page, pageSize) => {
    this.editSearchData({ offset:(page-1)*pageSize, limit:pageSize }, false)
  };

    


 /**
  * Tree组件渲染时调用一次（处理已绑定单兵用户展开的组织）
  */
  firstClickLeaf = (bindUser) => {
    const { organization } = this.props;
    const parentOrgList = organization.getParentOrgListByOrgId(bindUser.organizationId);
    let expandkeys = parentOrgList.map(v => v.id);
    const arr = expandkeys.filter(v => v !== bindUser.organizationId);
    this.orgTree.onExpand(arr); 
  }
  /**
   * 获取组织下的用户
   */
  getUserListByOrgId = async (organizationId) => {
    const { user } = this.props;
    const params = {
      keywords: '',
      offset: 0,
      limit: 500,
      organizationId,
      containSubOrganization: 0, // 不包含子组织用户
    };
    const result = await Service.user.queryUsers(params);
    const list = result && result.data.list;
    return list;
  }
  /**
   * 树节点点击节点事件
   *    clickKey: 点击节点的 key 值
   */
  clickLeaf = (clickKey, isEdit) => { 
    const { firstClick, editItem:{ bindUser }, selectUser } = this.state;
    if(firstClick){
      this.setState({ firstClick: false })
      if(bindUser){
        clickKey = [bindUser.organizationId]
        this.firstClickLeaf(bindUser);
      }
    }
    this.getUserListByOrgId(clickKey[0]).then(list => {
      const options = {
        userList: list || [],
        activeOrgIds: clickKey
      }
      if(selectUser) {
        options.selectUser = bindUser || '';
      }
      this.setState(options);
    })
  };
  /**
   * 显示新建单兵弹窗
   */
  handleAddSoldier = () => {
    this.setState({
      content:2,
      isEdit: false,
      modalVisible: true,
      userList: [],
      editItem: {},
    });
  };

  /**
   * 显示编辑单兵弹窗
   * @param {object} editItem
   */
  editAction = async (editItem) => {
    let selectUser;
    if(editItem.isBind) {
      await Service.user.queryUserInfo({id:editItem.bindUserid}).then(res => {
        editItem.bindUser=res.data
        selectUser = res.data;
      })
    }
    this.setState({
      content:2,
      isEdit: true,
      modalVisible: true,
      firstClick: true,
      selectUser,
      editItem,
    });
  }
  
  /**
   * 弹窗选中用户事件
   */
  clickUserName = (item) => {
    const { userList, selectUser } = this.state;
    let newSelectUser='';
    if(!selectUser || selectUser.id !== item.id) {
      const userItem = userList.find(v => v.id === item.id);
      newSelectUser = userItem;
    }
    this.setState({
      selectUser:  newSelectUser,
    });
  }
  
  /**
   * 编辑、添加单兵确定事件
   */
  handleOk = async (newName) => {
    const { isEdit, selectUser, editItem } = this.state;
    this.setState({ confirmLoading: true })
    // 新建单兵
    if (!isEdit) { 
      const result = await this.addSoldier(newName);
      if(selectUser){
        return this.bindSoldier(result.id, newName);
      }else{
        this.handleCancel();
      }
    }
    // 编辑单兵
    const bindUser = editItem.bindUser; 
    // 编辑单兵名称
    if (editItem.deviceName !== newName) {
      editItem.deviceName = newName;
      await this.updateSoldierName(editItem, newName)
      // 绑定用户没变
      if(bindUser && selectUser && selectUser.id === bindUser.id) {
        this.handleSearch();
      }
    }
    // 未绑定
    if(!bindUser) { 
      return this.bindSoldier(editItem.id, editItem.deviceName);
    } 
    // 已绑定
    // 未选择用户：解绑
    if(!selectUser) {
      return this.unbindOk({userId: bindUser.id, deviceId: editItem.id}, {
        soldierName: editItem.deviceName,
        loginName: bindUser.loginName
      });
    } 
    // 选择了不同用户： 解绑 重新绑定
    if(selectUser.id !== bindUser.id) {
      await this.unbindSoldier(bindUser.id, editItem.id, {
        soldierName: editItem.deviceName,
        loginName: bindUser.loginName
      });
      return this.bindSoldier(editItem.id, editItem.deviceName)
    } 
    // 选择了同一个用户切单兵名称没变：直接取消

    this.handleCancel();
  };

  /**
   * 更新单兵名称
   */
  updateSoldierName = (editItem, newName) => {
    return Service.device.queryDeviceInfo(editItem.id,true).then((result) => {
      const options = {
        deviceName:newName,
        id:result.data.id,
        otherInfo:result.data
      }
      result.deviceName = newName;
      result.data = result.data.id
     return Service.device.updateDevice(options);
    });
  }

  /**
   * 添加单兵
   */
  addSoldier = (newName) => {
    let newSoldierInfo = {
      // brand: 'soldier',
      // model: 'app',
      deviceName: newName
    };
    return Service.soldier.registerSolosCamera(newSoldierInfo).then((result) => {
      return result&&result.data
    })
  }

  /**
   * 绑定单兵
   */
  bindSoldier = async (deviceId, soldierName) => {
    const { selectUser } = this.state;
    if (selectUser) {
      const bindInfo = {
        userId: selectUser.id,
        deviceId
      };
      await Service.soldier.bindUser(bindInfo, {
        soldierName,
        loginName: selectUser.loginName
      })
    } 
    this.handleCancel();
    this.handleSearch();
  }

  /**
   * 解绑单兵
   */
  unbindSoldier = (userId, deviceId, logInfoObj) => {
    return Service.soldier.unbindUser({
      userId, deviceId
    }, logInfoObj).then(res => {
      message.success('解除绑定成功');
    }).catch(() => {})
  }

  /**
   * 编辑、添加取消弹窗
   */
  handleCancel = () => {
    this.setState({
      modalVisible: false,
      confirmLoading: false,
      selectUser: {},
      unbindInfo: {},
    });
  };

  /**
   * 解除绑定 logInfoObj -- 日志相关信息收集
   */
  unbindOk = async ({userId, deviceId}, logInfoObj) => {
    this.setState({ confirmLoading: true });
    await this.unbindSoldier(userId, deviceId, logInfoObj)
    this.handleCancel();
    this.handleSearch();
  }

  /**
   * 解绑弹窗
   */
  disconnectAction = item => {
    if (item.isBind !== 1) {
      return;
    }
    this.setState({
      modalVisible: true,
      content:1,
      unbindInfo: item,
    })
  };
/**
 * content 分别为1: 解绑弹窗， 2: 编辑弹窗, 3: 添加弹窗
 */
  getContentOptions = (content) => {
    let contentOptions;
    switch(content) {
      case 1:
        const { unbindInfo } = this.state;
        const userId = unbindInfo.bindUserid;
        const deviceId = unbindInfo.id;
        contentOptions = {
          bindName: unbindInfo && unbindInfo.bindUserName,
          unbindOk: () => this.unbindOk({ userId, deviceId }, {
            soldierName: unbindInfo.deviceName,
            loginName: unbindInfo.realName
          }),
          unbindCancel: this.handleCancel,
        }
      break;
      case 2:
        const { selectUser, isEdit, editItem, activeOrgIds, userList, confirmLoading } = this.state;
        contentOptions = {
          selectUser,
          isEdit,
          editItem,
          activeOrgIds,
          userList,
          confirmLoading,
          clickUserName: this.clickUserName,
          treeRef: orgTree => this.orgTree = orgTree,
          leafClk: this.clickLeaf,
          onOk: this.handleOk,
          onCancel: this.handleCancel,
        }
      break;
      default:break;
    }
    return contentOptions
  }
  render() {
    const { soldier } = this.props;
    const { searchData } = soldier;
    const {
      list,
      total,
      loading,
      modalVisible,
      content,
      selectedRowKeys,
      selectedRows
    } = this.state;
    const contentOptions = modalVisible ? this.getContentOptions(content) : {};
    const rowSelection={
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
          selectedRows
        })
      },
    }
    return (
      <WrapperView 
        name=' '
      >
        <div className="soldier-container">
          <div className='title-l'>单兵管理</div>
          <div className="soldier-content-wrapper">
            <Title>
              <AuthComponent actionName="soldierManagement">
                <Button type="primary" icon="plus" className="orange-btn" onClick={() => this.handleAddSoldier()}>
                  新建单兵
                </Button>
              </AuthComponent>
              <SearchView onSearch={this.editSearchData} />
            </Title>
            <Table
              rowSelection={rowSelection}
              editAction={this.editAction}
              total={total}
              searchData={searchData}
              dataSource={list}
              loading={loading}
              onChange={this.handlePageChange}
              disconnectAction={this.disconnectAction}
              scroll={{ y: '100%' }}
            />
            {modalVisible && (
              <SoldierModal 
                visible={modalVisible}
                content={content}
                contentOptions={contentOptions}
              />
            )}
          </div>
        </div>
      </WrapperView>
    );
  }
}

export default Soldier;