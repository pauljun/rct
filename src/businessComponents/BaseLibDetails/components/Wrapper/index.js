import React from 'react'
import './index.less'

export default ({
  children = null
}) => {
  return (
    <div className='baselib-detail-wrapper'>
      <div className='b-container'> 
        {children}
      </div>
    </div>
  )
}