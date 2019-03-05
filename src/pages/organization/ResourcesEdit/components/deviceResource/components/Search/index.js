import React from 'react'

const SearchInput = Loader.loadBaseComponent('SearchInput')

export default ({
  onChange
}) => {
  return(
    <div className='search-container'>
        <SearchInput 
          placeholder='请输入设备名称搜索'
          onPressEnter={e => {
            onChange({
              keywords: e.target.value
            })
          }}
        />
    </div>
  )
}