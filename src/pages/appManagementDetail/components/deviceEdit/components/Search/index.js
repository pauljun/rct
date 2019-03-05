import React from 'react'
import { Select } from 'antd'

const Option = Select.Option
const SearchInput = Loader.loadBaseComponent('SearchInput')

export default ({
  lyGroup,
  onChange
}) => {
  return(
    <div className='search-container'>
      <div className='s1'>
        <Select
          onChange={value => 
            onChange({
              deviceTypes: [value]
            })
          }
          placeholder='全部类型'
        >
          {Dict.map.communityDeviceType.map(v => 
            <Option title={v.label} value={v.value}>{v.label}</Option>
          )}
        </Select>
      </div>
      <div className='s2'>
        <Select
          onChange={value => onChange({ lygroupId: value })}
          placeholder='全部分组'
        >
          <Option title='全部' value=''>全部</Option>
          {lyGroup && lyGroup.map(v => 
            <Option title={v.name} value={v.id}>{v.name}</Option>
          )}
        </Select>
      </div>
      <div className='s3'>
        <SearchInput 
          placeholder='请输入设备名称或SN码搜索'
          onPressEnter={e => {
            onChange({
              keywords: e.target.value
            })
          }}
        />
      </div>
    </div>
  )
}