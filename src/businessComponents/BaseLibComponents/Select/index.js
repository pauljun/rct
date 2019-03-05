/**
 * @author wwj
 * @createTime 2019-1-7
 */

import React, { Component } from 'react'
import { Select } from 'antd'
import './index.less'

const IconFont = Loader.loadBaseComponent('IconFont')
const Option = Select.Option
class GroupSelect extends Component {
  render(){
    const { 
      label = '标题', 
      iconFont, 
      data, 
      value, 
      placeholder, 
      change, 
      name 
    } = this.props
    return (
      <div className='item'>
      <div className='search-title'>
        {iconFont && <IconFont 
          type={iconFont}
        />}
        {label}：
      </div> 
      <div className='search-content'>
        <Select 
          placeholder={placeholder}
          onChange={(v) => change({[name]: v})}
          value={value}
          showSearch
          optionFilterProp="children"
          className='car-search'
        >
          {data.map(v => {
            return <Option value={v.value} key={v.value}>{v.label}</Option>        
          })}
        </Select>
      </div>
    </div>
    )
  }
}

export default GroupSelect