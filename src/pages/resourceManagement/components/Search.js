import React from 'react';
import { Select } from 'antd';

const SearchInput = Loader.loadBusinessComponent('SearchInput')
const Option = Select.Option;
export default ({ value, onSearch, deviceGroup ,typeChange,groupChange,DeviceType}) => {
  return (
    <div class='resource-management-container clearfix'>
      <div className='fl'>
        <div className='label'>
          场所下设备列表：
        </div>
        <Select placeholder="全部类型" style={{ width: 120 ,marginRight:8}} onChange={typeChange}>
          {DeviceType.map(item => (
            <Option title={item.label} key={item.value} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
        <Select placeholder="全部分组" style={{ width: 120 ,marginRight:8}} onChange={groupChange}>
          {deviceGroup.map(item => (
            <Option title={item.label} key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>

      </div>
      <div className='fr'>
        <SearchInput 
        onChange = {
          value => {
            onSearch({
              keywords:value,
            })
          }
        }
          
          placeholder='请输入设备名称查询'
        />
      </div>
    </div>
  );
};
