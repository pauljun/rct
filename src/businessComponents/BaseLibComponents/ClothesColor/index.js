/**
 * @author wwj
 * @Date 2019-1-9
 * @Update wwj
 * @UpdateTime 2019-1-9
 */

import React from 'react';
import { Select } from 'antd';
import IconFont from 'src/components/IconFont'
import ColorSpan from './colorSpan'
import './index.less'
const Option = Select.Option;
const bodyColor = Dict.map.bodyColor;

const getOption = (v) => {
  if(v.color === '全部'){
    return <IconFont 
    className='icon-all-color'
    type={'icon-Skin_Main'}/>
  }else if(v.color === '花色'){
    return <ColorSpan />
  }else {
    return <span 
    className={`color-bg ${v.label === '白色' || v.label === '全部' ? 'bg-border-white' : ''}`} 
    style={{
      'backgroundColor':v.color,
      width:'14px', 
      height:'14px',
      display:'inline-block'
    }}></span>
  }
}
const ColorSelect = (
  {
    label, 
    iconFont, 
    placeholder, 
    change, 
    // 上衣数据
    nameUpper, 
    valueUpper, 
    // 下衣数据
    nameLower, 
    valueLower, 
    activeTabId
  }
) => {
  return ( 
    <div className='clothes-color-wrapper'>
      <div className='search-title'>
        {iconFont && <IconFont type={iconFont}/>}
        {label}：
      </div> 
      <div className='search-content clearfix' id={`a-${activeTabId}`}>
        <Select 
          placeholder={placeholder}
          onChange={(v) => change({[nameUpper]: v})}
          value={valueUpper}
          showSearch
          optionFilterProp="children"
          className='color-select fl'
          getPopupContainer={() => document.getElementById(`a-${activeTabId}`)}
        >
          {bodyColor.map(v => {
            return <Option value={v.value} key={v.value}>
               {getOption(v)} 
               {v.label} 
              </Option>        
          })}
        </Select>
        <Select 
          placeholder={placeholder}
          onChange={(v) => change({[nameLower]: v})}
          value={valueLower}
          showSearch
          optionFilterProp="children"
          className='color-select fr'
          getPopupContainer={() => document.getElementById(`a-${activeTabId}`)}
        >
          {bodyColor.map(v => {
            return <Option value={v.value} key={v.value}>
              {getOption(v)}
              {v.label}</Option>        
          })}
        </Select>
      </div>
    </div>
  )
}

export default ColorSelect;