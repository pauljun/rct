import React from 'react'
const {deviceType} = Dict.map
const Table = Loader.loadBaseComponent('Table')
const Pagination = Loader.loadBaseComponent('Pagination')
const tableComponent = ({
  total, 
  searchData, 
  onChange,
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
      title: '设备名称',
      dataIndex: 'deviceName'
    },
    {
      width: 150,
      title: 'SN码',
      dataIndex: 'sn'
    },
    {
      width: 150,
      title: '设备类型',
      dataIndex: 'deviceType',
      render(text, item, index) {
        return deviceType.find(v => {
          return v.value.split(',').indexOf(item.deviceType) >= 0
        }) && deviceType.find(v => {
          return v.value.split(',').indexOf(item.deviceType) >= 0
        }).label;
      }
    },
    {
      width: 150,
      title: '所属上级场所',
      dataIndex: 'placeName',
    },
    {
      width: 150,
      title: '分组类型',
      dataIndex: 'lygroupId',
      render: text => {return props.deviceGroup.find(v => {return v.id===text})&&props.deviceGroup.find(v => {return v.id===text}).name}
    },
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
        current={(searchData.offset/searchData.limit)+1}
        onChange={onChange}
      />      
    </div>
  )
}

export default tableComponent