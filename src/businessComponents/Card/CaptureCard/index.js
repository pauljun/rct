import React,{ Component } from 'react'
import { Progress } from 'antd'
import './index.less'
const ImageView = Loader.loadBusinessComponent('ImageView')
const IconFont = Loader.loadBaseComponent('IconFont')
/**
 * @desc 基础卡片
 * @param {string} className 类名
 * @param {boolean} imgHasHover img是否有hover效果
 * @param {string} score 相似度
 * @param {string} plateNo 车牌号码
 * @param {string} imgUrl 图片url
 * @param {string} deviceName 设备名称
 * @param {string} captureTime 抓拍时间
 * @param {string} relativeIcon 关联图标
 * @param {*} renderItem 自定义渲染函数
 * @param {*} CheckboxItem checkout
 * @param {function} onClick 点击回调函数
 */
class CaptureCard extends Component {
  render(){
    const { 
      score,
      plateNo, 
      deviceName, 
      imgHasHover=true, 
      captureTime, 
      imgUrl='',
      relativeIcon='icon-Body_Main', 
      renderItem=undefined,
      checkboxItem=undefined,
      className,
      onClick,
      children
    } = this.props
    return (
      <div className={`capture-card-item ${className}`} onClick={onClick}>
        <div className={`item-img-box${imgHasHover && imgUrl ? ' item-img-hover' : ''}`}>
          <ImageView src={imgUrl}/>
          { relativeIcon && <IconFont type={relativeIcon} />}
          { checkboxItem }
        </div>
        <div className='item-info'>
          {score && <div className='item'>
            <Progress type="circle" strokeWidth={15} width={14} percent={Number(score.toFixed())} strokeColor="#FFAA00" showInfo={false} />
              相似度 <span>{score.toFixed()}%</span>
          </div>}
          {plateNo && <div className="item plate-number">
            <IconFont type='icon-Brand_Dark'/>
            {plateNo}
          </div>}
          {deviceName && <div className='item device-name' title={deviceName}>
            <IconFont type='icon-Add_Main' />
            {deviceName}
          </div>}
          {captureTime && <div className='item'>
            <IconFont type='icon-Clock_Main2' />
            {Utils.formatTimeStamp(captureTime)}
          </div>}
          {children}
        </div>
      </div>
    )
  }
}
export default CaptureCard