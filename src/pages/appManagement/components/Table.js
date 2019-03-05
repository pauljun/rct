import React from 'react'
import { Tooltip } from 'antd'

const Table = Loader.loadBaseComponent('Table')
const Pagination = Loader.loadBaseComponent('Pagination')
const IconFont = Loader.loadBaseComponent('IconFont')
const tools = [
  {title: '编辑',icon: 'icon-Edit_Main',type: 1},
  {title: '配置系统模块',icon: 'icon-DataPanel_Dark',type: 2},
  {title: '分配资源',icon: 'icon-_Video',type: 3},
]

const tableComponent = ({
  total, 
  searchData, 
  onChange, 
  goPage, 
  del,
  getContactPhone,
  ...props
}) => {
  const columns = [
    {
      width: 60,
      title: '序号',
      dataIndex: 'id',
      render(text, item, index) {
        return index + 1;
      }
    },
    {
      width: 250,
      title: '应用系统名称',
      dataIndex: 'operationCenterName'
    },
    {
      width: 100,
      title: '联系人',
      dataIndex: 'contactPerson'
    },
    {
      width: 104,
      title: '联系电话',
      dataIndex: 'contactPhone',
      render: (text, record) => {
        if(text){
          return text
        }else{
          return (
            <div 
              className='concat-phone-hide'
              onClick={getContactPhone.bind(this, record.id)}
            >
              ***********
            </div>
          )
        }
      }
    },
    {
      width: 120,
      title: '登录账号',
      dataIndex: 'userInfo',
      render: item => <div>{item.loginName}</div>
    },
    {
      width: 120,
      title: '设备数量(台)',
      dataIndex: 'deviceCount',
      render: text => text || 0
    },
    {
      width: 120,
      title: '场所数量(个)',
      dataIndex: 'placeCount',
      render: text => text || 0
    },
    {
      title: '操作',
      dataIndex: 'tools',
      render: (text, item) => (
        <div className='table-tools'>
          {tools.map(v => 
            <Tooltip
              title={v.title}
            >
              <IconFont
                type={v.icon}
                onClick={() =>
                  goPage('appManagementDetail', {
                    id: item.id,
                    type: v.type
                  })
                }
              />
            </Tooltip>
          )}
          <Tooltip
            title="删除"
          >
            <IconFont
              type="icon-Delete_Main"
              onClick={() => del(item)}
            />
          </Tooltip>
        </div>
      )
    }
  ]  
  return (
    <div class='tb'>
      <Table 
        columns={columns}
        {...props}
      />
      <Pagination
        total={total}
        pageSize={searchData.limit}
        current={searchData.offset}
        onChange={onChange}
      />      
    </div>
  )
}

export default tableComponent