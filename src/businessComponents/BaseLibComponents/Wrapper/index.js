/**
 * @author wwj
 * @createTime 2019-1-7
 * @modify tlzj 2019-1-17
 */

import React from 'react'
import { Button } from 'antd'
import './index.less'

export default ({
  className = '',
  title = '人脸图库',
  reset,
  wrapperLeftWidth='300px',
  ...props
}) => {
  return <div className={`baselib-wrapper ${className}`}>
    <div className='nav'>
      <div className='title' style={{width: wrapperLeftWidth}}>
        <strong>{title}</strong>
        {reset && <Button onClick={reset && reset}>
          重置
        </Button>}    
      </div>
      <div className='module-header'>
        {props.children[2]}
      </div>
    </div>
    <div className='wrapper'>
      <div className='container'>
        <div className='search' style={{width: wrapperLeftWidth}}>
          {props.children[0]}
        </div>
        <div className='wrapper-content'>
          {props.children[1]}
        </div>
      </div>
    </div>
  </div>
}