import React from 'react'
import './Table.less';

const IconSpan = Loader.loadBaseComponent('IconSpan');
const Pagination=Loader.loadBaseComponent('Pagination');
const SettingTable=Loader.loadBaseComponent('Table')
const AuthComponent = Loader.loadBusinessComponent("AuthComponent");

class view extends React.Component {
  render() {
    const {
      dataSource,
      loading,
      total,
      searchData,
      onChange,
      disconnectAction,
      editAction,
      ...props
    } = this.props
    const columns = [
      {
        title: "序号",
        width: "8%",
        dataIndex: "index",
        render: (status, item, index) => index + 1
      },
      {
        title: "单兵名称",
        width: "20%",
        dataIndex: "deviceName",
        // render: (text, item) => <a onClick={ () => item.roleType !== 111902 && editAction(item, '编辑单兵','view')} href>{text}</a>
      },
      {
        title: "单兵编号",
        width: "20%",

        dataIndex: "sn",
      },
      {
        title: "是否绑定",
        width: "10%",
        dataIndex: "isBind",
        render: text => <span>{text === 1 ? '已绑定' : '未绑定'}</span>
      },
      {
        title: "用户名",
        width: "15%",
        dataIndex: "bindUserName",
      },
      {
        title: "绑定账号",
        width: "15%",
        dataIndex: "realName",
      },
      {
        title: "操作",
        dataIndex: "action",
        width: "17%",
        render: (text, item) => {
          return (
            <div className='table-tools'>
              <span className='icon-span'>
              <AuthComponent actionName="soldierManagement">
                <IconSpan 
                  icon="icon-Edit_Main"
                  onClick={() => editAction(item,'编辑单兵设备')}
                  className="actionIcon"
                  title='编辑单兵'
                />
              </AuthComponent>
              </span>
              <AuthComponent actionName="soldierManagement">
              <IconSpan 
                className="actionIcon"
                onClick={() => disconnectAction(item)}
                icon={item.isBind === 1 ? 'icon-OnLine_Main' :'icon-OffLine_Main'}
                title='解除单兵绑定'
                disabled={item.isBind === 1 ? false : true}
              />
              </AuthComponent>
            </div>
          );
        }
      }
    ];
    return (
      <div className='soldier-table-container'>
        <SettingTable
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          {...props}
        />
        <Pagination
          total={total}
          pageSize={searchData.limit}
          current={(searchData.offset/searchData.limit)+1}
          onChange={onChange}
        />
      </div>
    )
  }
}

export default view