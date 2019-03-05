import React from 'react'

export default ({
  captureTime,
  deviceName
}) => {
  return <div className='box-container'>
    <ul className='header'>
      <li>
        抓拍地点 :  
        <span>{deviceName ? deviceName : '-'}</span>
      </li>       
      <li>
        抓拍时间 :  
        <span>{Utils.formatTimeStamp(parseInt(captureTime, 10))}</span>
      </li>  
    </ul>
  </div>
}