import React from 'react'
import { Select } from 'antd'
import './index.less'

const RefreshButton = Loader.loadBaseComponent('RefreshButton')
const IconFont = Loader.loadBaseComponent('IconFont')
const Option = Select.Option
const imgStyleOptions = [
  { value: 'small', label: '小图' },
  { value: 'normal', label: '标准' },
  { value: 'large', label: '大图' }
]

export default ({
  value,
  onChange,
  Refresh,
  isSelect = true,
  refresh = true
}) => {
  return (
    <div className='title-options-container'>
      {isSelect && <span>
        <Select
          value={value}
          onChange={onChange}
          size='small'
          suffixIcon={<IconFont type='icon-Arrow_Big_Down_Main' />}
        >
          {imgStyleOptions.map(v => <Option key={v.value} value={v.value}>{v.label}</Option>)}
        </Select>
      </span>}
      {refresh && <RefreshButton 
        onClick={Refresh}
      >
      </RefreshButton>}
    </div>
  )
}