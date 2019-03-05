import React from 'react'
import { Progress } from 'antd'
import './index.less'
const ImageView = Loader.loadBusinessComponent('ImageView')
const IconFont = Loader.loadBaseComponent('IconFont')

export default ({
  url = null,
  active = false,
  deviceName = '',
  cameraName = '',
  className = '',
  captureTime,
  score,
  plateNo,
  ...props
}) => {
  return (
    <div className={`detail-box-item ${className} ${active ? 'active' : ''}`} {...props}>
      <div className='box-img'>
        <ImageView 
          src={url}
        />
      </div>
      {score && <div className='item'>
        <Progress type="circle" strokeWidth={15} width={14} percent={Number(score.toFixed())} strokeColor="#FFAA00" showInfo={false} />
          相似度 <span>{score.toFixed()}%</span>
      </div>}
      {plateNo && <div className="item">
          <IconFont type='icon-Brand_Dark'/>
          {plateNo || '-'}
        </div>}
      <div className='item item-device-name' title={deviceName || cameraName || '-'}>
        <IconFont type='icon-Add_Main' />
        {deviceName || cameraName || '-'}
      </div>
      <div className='item'>
        <IconFont type='icon-Clock_Main2' />
        {Utils.formatTimeStamp(captureTime)}
      </div>
    </div>
  )
}