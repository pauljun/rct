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
        <SearchInput 
          placeholder='请输入小区名称搜索'
          onPressEnter={e => {
            onChange({
              keywords: e.target.value
            })
          }}
        />
    </div>
  )
}