import React from 'react'
import { Input } from 'antd'
import './index.less'
const Search = Input.Search

export default ({ 
  defaultValue, 
  onSearch, 
  width = 240, 
  ...props 
}) => {
  return (
    <Search
      enterButton
      style={{width: width}}
      onSearch={onSearch && onSearch}
      {...props}
    />
  );
};
