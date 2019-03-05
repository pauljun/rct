import React from 'react'
import {Input} from 'antd'
// const Search = Input.Search;
const Search=Loader.loadBaseComponent('SearchInput');

export default ({
  searchData,
  onChange
}) => {
  return (
    <div className='org-wrapper-search'>
      <div className='search-group'>
        <Search
          placeholder="请输入组织名称搜索"
          enterButton
          onChange={value => onChange({keywords:value, offset: 0})}
          defaultValue={searchData.keywords}
        />
      </div>
    </div>
  )
}