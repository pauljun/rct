import React from 'react';
import { Button } from 'antd';
import './index.less';

const IconFont = Loader.loadBaseComponent('IconFont');

const RefreshButton = ({onClick, loading=false, className='', size='default', ...props}) => {
  return (
    <Button className={`refresh-button ${size === 'default' ? 'refresh-default' : 'refresh-lg'} ${className}`} loading={loading} onClick={onClick && onClick}>
      {!loading && <IconFont
      type={'icon-Right_Main'}
      theme="outlined"/> }刷新
    </Button>
  )
}

export default RefreshButton;