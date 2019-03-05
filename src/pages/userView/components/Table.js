import React from 'react';
import { Switch,message,Button} from 'antd';

const Table = Loader.loadBaseComponent("Table");
const Pagination = Loader.loadBaseComponent("Pagination");
const ModalView = Loader.loadBaseComponent("ModalComponent");
const ModalDeleteView = Loader.loadBaseComponent("ConfirmComponent");
const AuthComponent = Loader.loadBusinessComponent("AuthComponent");
const IconFont = Loader.loadBaseComponent("IconFont");
const getKeyValue=Dict.getLabel
const ADMIN_CODE = 100702;

@Decorator.businessProvider('organization','userManagement')
class UserTable extends React.Component {
  state={
    deleteShow: false,
    deleteInfo: '',
    userCheckView:false,
  }
  componentDidMount() {
    const { deleteRef } = this.props;
    deleteRef && deleteRef(this)
  }
  // 取消删除弹窗
  deleteCancel = () => {
    this.setState({
      deleteShow:false, 
      deleteInfo: ''
    })
  }

  // 显示删除弹窗
  deleteAction = (item) => {
    this.setState({
      deleteShow:true,
      deleteInfo:item
    })
  }

  deleteOk = (deleteInfo) => {
    this.props.deleteOk(deleteInfo).then(() => {
      message.success(`删除${deleteInfo.loginName}成功`)
      this.deleteCancel();
    })
  }

  goPage = (moduleName,item) => {
    const {userCheckView} = this.state
    if(userCheckView){
      this.setState({
        userCheckView:false
      })
    }
    this.props.goPage({
      moduleName,
      state: {
        id: item.id,
        name: item.realName,
        roleName:item.roleName,
        phoneNum:item.phoneNum,
        identityCardNum:item.identityCardNum
      },
    });
  };

  handleCancel = () => {
    this.setState({
      userCheckView:false,
    })
  }
  /**
   * 获取组织列表
   */
  getOrgList = () => {
    const { userManagement } = this.props;
    const data=userManagement.searchData;
    data.orgId = userManagement.activeKey[0]
    return Service.organization.queryOrg(data).then(res => {
      let list = res.result.data.map(v => {
        return {
          name: v.organizationName,
          id: v.id,
          parentId: v.parentId,
          desc: v.organizationDesc,
          type: v.organizationType,
          createTime: v.createTime,
          orgSort: v.orgSort
        };
      });
      res.result.data = list;  
      return res.result
    })
  }
  render() {
    const userInfo = Utils.getCache('userInfo', "session") || {};
    const userGrade = userInfo.userGrade;
    const {
      dataSource,
      total,
      loading,
      searchData,
      onChange,
      changeStatus,
      className,
      roleList,
      organization
    } = this.props;
    const { deleteShow, deleteInfo ,userCheckItems} = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        width: '10%',
        render: (text, record, index) => index + 1
      },
      {
        title: '用户名',
        width: '10%',
        dataIndex: 'loginName',
      },
      { 
        title: '姓名', 
        width: '12%', 
        dataIndex: 'realName', 
      },
      {
        title: '用户角色',
        width: '10%',
        dataIndex: 'roleIds',
        render : roleIds => {
          let roleName=[]
          roleIds&&roleIds.map(v => {
            roleList.find(r => {
              if(r.id==v){
                roleName.push(r.roleName)
              }
            })
          }
          )
          return (
            <span>{roleName.join('/')}</span>
          )
      }
      },
      {
        title: '性别',
        width: '8%',
        dataIndex: 'userSex',
        render: key => {
          const sex = getKeyValue('sex', key);
          return sex === '全部' ? '未知' : sex;
        }
      },
      { 
        title: '手机号', 
        width: '12%', 
        dataIndex: 'phoneNum' 
      },
      {
        title: '所属组织',
        dataIndex: 'organizationId',
        width: '15%',
        render: (text, item) => {
          let orgItem = organization.orgArray.find(v => text == v.id);
          return orgItem ? (
            <span title={this.props.organization.getOrgTreeText(text)}>
              {orgItem.name}
            </span>
          ): null;
        }
      },
      {
        title: '级别',
        width: '8%',
        dataIndex: 'userGrade'
      },
      {
        title: '状态',
        width: '7%',
        dataIndex: 'validState',
        render: (status, item) => {
          let disabledDom =
            item.userType === ADMIN_CODE ||
            item.id === userInfo.id ||
            userGrade <= item.userGrade ||
            BaseStore.menu.getInfoByName('UserOperata')
          return (
            <Switch
              className='user-Switch'
              size="small"
              checked={status === 104406}
              disabled={disabledDom}
              onChange={() => changeStatus(item)}
            />
          );
        }
      },
      {
        title: '操作',
        dataIndex: 'id',
        width: '8%',
        render: (text, item) => {
          const allowClick = item.userType !== ADMIN_CODE && item.id !== userInfo.id
          const disabledDom = item.userType === ADMIN_CODE || item.id === userInfo.id
          const showHandle = userGrade > item.userGrade;
          return (
            showHandle &&
            <div className="table-tools">
              <AuthComponent actionName="userEdit">
                <IconFont
                  type="icon-Edit_Main"
                  style={{ cursor: 'pointer' }}
                  title="编辑"
                  disabled = {disabledDom}
                  onClick={() => allowClick&&this.goPage('userEdit', item)}
                />
              </AuthComponent>
              <AuthComponent actionName="userEdit">
                <IconFont
                  type="icon-Delete_Main"
                  style={{ cursor: 'pointer' }}
                  title="删除"
                  disabled = {disabledDom}
                  onClick={() => allowClick && this.deleteAction(item)}
                />
              </AuthComponent>
            </div>
          )
        }
      }
    ];
    return (
      <React.Fragment>
        <Table
          rowSelection={this.props.rowSelection}
          className={className}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
        />
        <Pagination
          total={total}
          pageSize={searchData.limit}
          current={searchData.offset/searchData.limit+1}
          onChange={onChange}
        />
        <ModalDeleteView 
          visible={deleteShow}
          onOk = {() => this.deleteOk(deleteInfo)}
          onCancel = {this.deleteCancel}
          title= '删除确认'
          img = 'delete'
        >
          <p style={{textAlign: 'center'}}>
            确定删除 <span className='highlight'>{deleteInfo.loginName}</span>
          </p>
        </ModalDeleteView>
      </React.Fragment>
    );
  }
}
export default UserTable;
