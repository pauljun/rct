import React from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import { Modal,Button } from 'antd';
import Search from './components/search';
import BaseInfo from './components/baseInfo';
import AllocateResources from './ResourcesEdit';
import ModalView from './components/modalView';
import { withRouter } from 'react-router-dom'

import './index.less'

const confirm = Modal.confirm;
const Table = Loader.loadBaseComponent('Table');
const Pagination = Loader.loadBaseComponent('Pagination');
const BreadCrumb = Loader.loadBaseComponent('BreadCrumb');
const ModalDelete = Loader.loadBaseComponent('ConfirmComponent');
const IconSpan = Loader.loadBaseComponent('IconSpan');
const WrapperView = Loader.loadBusinessComponent('SystemWrapper');
const Title = Loader.loadBusinessComponent('SystemTitle')
const AuthComponent = Loader.loadBusinessComponent("AuthComponent");

@withRouter
@Decorator.businessProvider('orgManagement','user','organization','menu')
@Decorator.withEntryLog()
@observer
class OrganizationView extends React.Component {
  state = {
    /**渲染列表 */
    list: [],
    editShow: false,
    deleteShow:false,
    deleteInfo:'',
    data: {},
    total: 0,
    type: '',
    modalKey: Math.random(),
    //  获取当前点击的组织信息
    clickedOrgInfo: '',
    selectedRowKeys:[],
    selectedRows:null,

    //分配资源弹框
    showResourceList:false
  };
  componentWillMount(){
    const { orgManagement } = this.props
    orgManagement.initData()
  }
  /**子节点点击事件1 */
  leafClk(key) {
    const { orgManagement } = this.props;
    if (key.length !== 0) {
      orgManagement.setData({
        activeKey: key,
      });
      this.setState({
        pageIf: false
      });
    }
    orgManagement.editSearchData({
      id: key[0],
      offset:0
    });
    this.getBaseInfo();
    this.getUserList();
  }

  /**
   * 获取选中的组织信息
   */
  getBaseInfo = () => {
    const { orgManagement, organization } = this.props;
    const orgArray = organization.orgArray
    const orInfo= orgArray.find(v => v.id == orgManagement.activeKey[0]);
    // const orInfo= organization.getOrgInfoByOrgId(orgManagement.activeKey[0])
    this.setState({
      clickedOrgInfo: orInfo
    })
  };
  /*
   * 修改查询条件
   */
  editSearchData = options => {
    const { orgManagement } = this.props;
    orgManagement.editSearchData(options).then(() => {
      this.getUserList();
    });
  };
  getOrgList = () => {
    const { orgManagement } = this.props;
    const data=orgManagement.searchData;
    data.id =orgManagement.activeKey[0]
    return Service.organization.queryOrganizations(data).then(res => {
      let list = res.data.list.length>0 && res.data.list.map(v => {
        return {
          organizationName: v.organizationName,
          id: v.id,
          parentId: v.parentId,
          organizationDescription: v.organizationDescription,
          createTime: v.createTime,
          orgSort: v.organizationSort,
          type: v.organizationType,
        };
      });
      res.data.list = list;  
      return res
    })
  }
  getUserList = () => {
    this.setState({ loading: true });
    this.getOrgList().then(res => {
      this.setState({
        list: res.data.list,
        total: res.data.total,
        loading: false,
      })
    })
  };

  /**
   * 分页切换查询
   */
  onChange = (currentPage, pageSize) => {
    this.editSearchData({
      limit:pageSize,
      offset:(currentPage-1)*pageSize
    });
  };
  // 上移或者下移组织
  orderAction = (item,index,type) => {
    var that = this;
    const { list } = this.state;
    const Index = type && type==='isUp'? (list.findIndex(v => v.id == item.id) - 1) : (list.findIndex(v => v.id == item.id) + 1);
    const title = type && type==='isUp'? '请确认是否上移组织':'请确认是否下移组织'
    let upOptions = [
      {
        id: item.id, // 当前ID
        sort: list[Index].orgSort // 上一个orgSort
      },
      {
        id: list[Index].id, // 上一个ID
        sort: item.orgSort // 当前orgSort
      }
    ]
    let downOptions = [
      {
        id: item.id, // 当前ID
        sort: list[Index].orgSort // 上一个orgSort
      },
      {
        id: list[Index].id, // 上一个ID
        sort: item.orgSort // 当前orgSort
      }
    ]
    // 操作步骤
    confirm({
      title,
      content:`${item.organizationName}`,
      onOk(){
        if(type&&type === 'isUp'){
          Service.organization.sortOrganization(upOptions).then(function() {
            that.getUserList();
            Shared.queryOrganizationDevice();
          });
        }else{
          Service.organization.sortOrganization(downOptions).then(function() {
            that.getUserList();
            Shared.queryOrganizationDevice();
          });
        }
      },
      onCancel(){
        return Promise.resolve();
      },
      okType: 'danger',
      cancelText: '取消',
      okText: '确定'
    })
  }
  /**
   * 新增组织或者编辑组织,分配资源
   */
  operateOrg = (item,type) => {
    if(type=='resource'){
      this.setState({
        data:item,
        showResourceList: true,
      })
    }else{
      this.setState({
        data:item,
        editShow: true,
        type: type,
        modalKey: Math.random()
      })
    }
  }

  cancleResource = () => {
    this.setState({
      showResourceList: false,
    })
  }
  allocateResource = () => {
    this.setState({
      showResourceList: false,
    })
  }

  CancelModal = () => {
    this.setState({
      editShow: false
    });
  };
  // 删除组织
  deleteAction(item) {
    this.setState({
      deleteShow:true,
      deleteInfo:item,
    })
  }
  deleteOk = () => {
    var that = this;
    const { deleteInfo } = this.state
    let options = {
      id: deleteInfo.id
    };
    Service.organization.deleteOrganization(options,deleteInfo.organizationName).then(() => {
      this.getOrgList().then(res => {
        that.setState({
          list: res.data.list
        });
      })
      // Service.organization.updateOrganization(deleteInfo)
      Shared.queryOrganizationDevice();
    });
    this.deleteCancel()
  }
  deleteCancel = () => {
    this.setState({
      deleteShow:false
    })
  }
  deleteGroup = () => {
    const {selectedRows}=this.state
    let deleteGroupInfo = []
    selectedRows.map(v => {
      deleteGroupInfo.push(v.name)
    })
    this.setState({
      deleteShow:true,
      deleteInfo:{name:deleteGroupInfo.join(' 、')},
    })
  }
  onSubmit = (data, value, type) => {
    const { orgManagement} = this.props;
    let options = {
      organizationDescription: value.organizationDesc,
      organizationName: value.organizationName,
      parentId: orgManagement.searchData.id || 0,
    };
    let subAction = Service.organization.addOrganization;
    if (type === 'edit') {
      options.id = data.id;
      subAction = Service.organization.updateOrganization;
    }
    return subAction(options).then(() => {
      this.getUserList();
      Shared.queryOrganizationDevice();
    });
  };
  render() {
    const { organization, orgManagement } = this.props;
    const columns = [
      {
        title: '序号',
        key: 'id',
        width: '10%',
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: '组织名称',
        dataIndex: 'organizationName',
        width: '25%',
        render: (text, record) => {
          const id=[record.id]
           let orgTreeInfo=organization.orgList.filter(
             v => id.indexOf(v.id) > -1
           )[0];
           if(!orgTreeInfo){
             return null
           }
           return (
             <span title={organization.getOrgTreeText(orgTreeInfo.id)}>{text}</span>
           );
         }

      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: '20%',
        render: time =>
          time && moment(parseInt(time, 10)).format('YYYY.MM.DD HH:mm:ss')
      },
      {
        title: '描述',
        width: '25%',
        dataIndex: 'organizationDescription'
      },
      {
        title: '操作',
        width: '20%',
        dataIndex: 'action',
        key: '10',
        render: (text, record, index) => {
          const isUp = index === 0;
          const isDown = index === list.length - 1;
          return (
            <div className="table-tools">
              <AuthComponent actionName="organizationManage">
                <IconSpan
                  icon="icon-Edit_Main"
                  title="编辑"
                  onClick={() => this.operateOrg(record, 'edit')}
                />
              </AuthComponent>
              <AuthComponent actionName="organizationManage">
              <IconSpan
                  icon="icon-Layer_Main2"
                  title="分配资源"
                  onClick={() => this.operateOrg(record, 'resource')}
                />
              </AuthComponent>
              <AuthComponent actionName="organizationManage">
                <IconSpan
                  icon="icon-Delete_Main"
                  title="删除"
                  onClick={this.deleteAction.bind(this, record)}
                />
              </AuthComponent>
              <AuthComponent actionName="organizationManage">
                <IconSpan
                  title="上移"
                  onClick={() => this.orderAction(record, index,'isUp')}
                  disabled={isUp ? true : false}
                  icon="icon-UpDown_Up_Dark"
                />
              </AuthComponent>
              <AuthComponent actionName="organizationManage">
                <IconSpan
                  title="下移"
                  onClick={() => this.orderAction(record, index,'isDown')}
                  disabled={isDown ? true : false}
                  icon="icon-UpDown_Down_Dark"
                />
              </AuthComponent>

            </div>
          );
        }
      }
    ];
   /**
    * 批量删除操作
    */
    const rowSelection={
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
          selectedRows
        })
      },
    };
    const { searchData } = orgManagement;
    const { list, total, type, clickedOrgInfo, loading, modalKey ,selectedRowKeys} = this.state;
    return (
        <WrapperView 
           Treetitle='组织管理'
           treeActiveKey={orgManagement.activeKey}
           leafClk={this.leafClk.bind(this)}
           leftOrgTree={true}
           className='org-setting-wrapper'
           breadCrumb={orgManagement.activeKey && 
              <BreadCrumb
                list={organization.getParentOrgListByOrgId(
                  orgManagement.activeKey[0]
                ).reverse()}
              />
            }
          >
          <div className="org-table-content">
            <div className="org-baseInfo">
              <Title name='基本信息'/>
              <BaseInfo info={clickedOrgInfo}/>
            </div>
            <div className="org-table-container">
              <Title name='直属组织列表'/>
              <div className="org-table">
                <div className='org-Search-Btns'>
                  <AuthComponent actionName="organizationManage">
                    <Button
                      className='orange-btn'
                      type={'primary'}
                      icon={'plus'}
                      onClick={() => this.operateOrg('', 'add')}
                    >
                      新建直属组织
                    </Button>
                  </AuthComponent>
                  <Search searchData={searchData} onChange={this.editSearchData} />
                </div>
                <Table
                  columns={columns}
                  dataSource={list}
                  loading={loading}
                  scroll={{ y: '100%' }}
                  rowSelection={!this.props.menu.getInfoByName("organizationDelete") ? null:rowSelection}
                />
                <Pagination
                  total={total}
                  pageSize={searchData.limit}
                  current={(searchData.offset/searchData.limit)+1}
                  onChange={this.onChange}
                  simpleMode={false}
                />
              </div>
            </div>
              <ModalView
                key={modalKey}
                visible={this.state.editShow}
                CancelModal={this.CancelModal}
                data={this.state.data}
                onSubmit={this.onSubmit}
                type={type}
                operateOrg = {this.operateOrg}
              />
              <AllocateResources
                showResourceList={this.state.showResourceList}
                item={this.state.data}
                cancleResource = {this.cancleResource}
                allocateResource = {this.allocateResource}
                className='org-resource-wrapper'
              />
              <ModalDelete 
                visible={this.state.deleteShow}
                onOk = {this.deleteOk}
                onCancel = {this.deleteCancel}
                title= '删除确认'
                img = 'delete'
              >
                <p style={{textAlign: 'center'}} className='org-delete-modal'>确定删除 <span className='highlight'>{this.state.deleteInfo.organizationName}</span></p>
              </ModalDelete>
          </div>
        </WrapperView>
    );
  }
}
export default OrganizationView;