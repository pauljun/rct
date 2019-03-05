/**
 * @desc 车票颜色
 * @author wwj
 * @createTime 2019-1-11
 * @updateTime 2019-1-11
 */
import React from 'react'
import { Radio } from 'antd'
// 车牌图片 
import BrandBlack from './img/Brand_Black.svg'
import BrandBlue from './img/Brand_Blue.svg'
import BrandGreen from './img/Brand_Green.svg'
import BrandWhite from './img/Brand_White.svg'
import BrandYellow from './img/Brand_Yellow.svg'
import BrandYellowGreen from './img/Brand_Yellow_Green.svg'

const IconFont = Loader.loadBaseComponent('IconFont')
const colorArray = [BrandWhite, BrandBlack, BrandYellow, BrandBlue, BrandGreen, BrandYellowGreen]
const RadioGroup = Radio.Group
const PlateColor = (props) => {
  const { label = '标题', iconFont, data, name, value } = props
  return (
    <div className='item'>
      <div className='search-title'>
        {iconFont && <IconFont 
          type={iconFont}
        />}
        {label}：
      </div> 
      <div className='search-content'>
        {data && <RadioGroup onChange={(e) => props.change({[name]: e.target.value === '' ? null : e.target.value})} value={value===null ? '': value}>
          {
            data.map((v,index) => {
              return <Radio value={v.value || ''} key={v.value}>
                { v.label ? <img title={v.text} src={colorArray[v.label - 1]}/> : v.text }
              </Radio>
            })
          }
        </RadioGroup>}
      </div>
    </div>
  )
}

export default PlateColor