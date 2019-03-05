import React from 'react'
import moment from 'moment'
import './header.less'

const WaterMark = Loader.loadBusinessComponent('WaterMarkView')

const text = {
  face: '人脸',
  body: '人体',
  vehicle: '车辆'
}

const HeaderImgSearch = ({
  url, 
  score,
  cameraName,
  captureTime,
  type = 'face',
  ...props
}) => {
  return(
    <div className='data-repository-img-search'>
      <div className="upload-img img-box">  
        <div className="img">
          <WaterMark src={url} type={type}/>
        </div>
        <div className="title">上传{text[type]}</div>
      </div>
      <div className="compare-img img-box">
        <div className="img">
          <WaterMark src={props[`${type}Url`]} type={type}/>
        </div>
        <div className="title">对比{text[type]}</div>
      </div>
      <div className="compare-result">
        <div className="similar-value">
          <div className="left">相似度</div>
          <div className="center">
            <div style={{
              width: score + 'px',
              height:'100%'
            }}></div>
          </div>
          <div className="right">{(score*100).toString().substring(0,2)}%</div>
        </div>
        <div className="res-container">
          <div className="res-address list">
            抓拍像机：<span>{cameraName || '-'}</span>
          </div>
          <div className="res-capture-time list">
            抓拍时间： <span>{captureTime ? moment(parseInt(captureTime,10)).format('YYYY.MM.DD HH:mm:ss'): '-'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default HeaderImgSearch