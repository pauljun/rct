import React from 'react'
import { Button } from 'antd'
import './index.less'

const IconFont = Loader.loadBaseComponent('IconFont')

export default ({
  page = 1,
  total,
  pageSize,
  onChange
}) => {
  const maxPage = Math.ceil(total / pageSize) || 1
  const disabledPrev = page <= 1
  const disabledNext = page >= maxPage
  page = disabledNext ? maxPage : page
  return (
    <div className='pagination-btn-container'>
      <span 
        className='c-btn' 
        key='prev'
      >
        <Button 
          className='page-btn' 
          disabled={disabledPrev} 
          onClick={() => onChange('prev')}
        >
          <IconFont 
            type={'icon-Arrow_Big_Left_Main'}
          />
        </Button>
      </span>
      <span 
        style={{fontSize: '14px', margin: '0 10px'}} 
        key='page'
      >
        第{page}页
      </span>
      <span 
        className='c-btn' 
        key='next'
      >
        <Button 
          className='page-btn' 
          disabled={disabledNext} 
          onClick={() => onChange('next')}
        >
          <IconFont 
            type={'icon-Arrow_Big_Right_Main'} 
            theme="outlined" 
          />
        </Button>
      </span>
    </div>
  )
}
