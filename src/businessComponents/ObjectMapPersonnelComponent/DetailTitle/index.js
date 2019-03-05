import React from 'react';
import './index.less';
export default ({title = ''}) => {
  return (
    <div className='detail-ploy-header'>
    <div className='header-title'>
      {title}
    </div>
    <div className='header-download'>
      {/* <i className='pdf'></i>导出PDF */}
    </div>
  </div>
  )
}