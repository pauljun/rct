import React from 'react';
import { Button } from 'antd';
const SearchInput = Loader.loadBusinessComponent('SearchInput')

export default ({ value, onSearch, goPage }) => {
  return (
    <div class='s-container clearfix'>
      <Button
        type='primary'
        icon='plus'
        className='fl'
        onClick={() => goPage('appManagementAdd')}
      >
        新建应用系统
      </Button>
      <div className='fr'>
        <SearchInput 
          width='300'
          onPressEnter={e => 
            onSearch({
              keywords: e.target.value,
              offset: 1
            })
          }
          placeholder='请输入应用系统相关字段查询'
        />
      </div>
    </div>
  );
};
