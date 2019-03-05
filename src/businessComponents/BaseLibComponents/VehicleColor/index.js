/**
 * @desc 车票颜色
 * @author wwj
 * @createTime 2019-1-11
 * @updateTime 2019-1-11
 */
import React from 'react'
import { Radio } from 'antd'
import './index.less'
const IconFont = Loader.loadBaseComponent('IconFont')
const RadioGroup = Radio.Group
const VehicleColor = (props) => {
  const { 
    label = '标题', 
    iconFont, 
    data, 
    name, 
    value 
  } = props
  return (
    <div className='item'>
      <div className='search-title'>
        {iconFont && <IconFont 
          type={iconFont}
        />}
        {label}：
      </div> 
      <div className='search-content vehicle-color-select'>
        {data && <RadioGroup onChange={(e) => props.change({[name]: e.target.value === '' ? null : e.target.value})} value={value===null ? '': value}>
          {
            data.map(v => {
              return <Radio value={v.value || ''} key={v.value}>
                {v.value === 117713 ? 
                  <IconFont 
                  className='icon-other-color'
                  type={'icon-Theme_Main'}/>
                :
                <span 
                  className={v.value === null ? 'color-all' : ''}
                  style={{
                    backgroundColor: v.label,
                    width:'14px', 
                    height:'14px',
                    display:'inline-block'
                  }}>
                </span>}
              {v.text}
              </Radio>
            })
          }
        </RadioGroup>}
      </div>
    </div>
  )
}

export default VehicleColor