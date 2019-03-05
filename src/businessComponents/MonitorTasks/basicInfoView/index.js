import React from 'react'
import moment from 'moment'
import { Row, Col } from 'antd'
const BasicInfoView = (props) => {
  const { item } = props
  let validTime=moment(item.validTime*1).format(Shared.format.dataTime) // 时间格式修改为全局
  let invalidTime=moment(item.invalidTime*1).format(Shared.format.dataTime)
  return (
    <div className="basic-info-view info-view">
      <Row>
        <Col span={24}>
          <div className='label'>任务名称：</div>
          <div className='content'>{item.name}</div>
        </Col>
        <Col span={24}>
          <div className='label'>创建人：</div>
          <div className='content'>{item.creatorName}</div>
        </Col>
        {props.libType !== 3 && <Col span={24}>
          <div className='label'>创建时间：</div>
          <div className='content'>{moment(item.createTime*1).format(Shared.format.dataTime)}</div>
        </Col>}
        <Col span={24}>
          <div className='label'>任务有效期：</div>
          <div className='content'>{item.validTime && item.invalidTime && `${validTime} ~ ${invalidTime}`}</div>
        </Col>
        {props.libType === 3 && <Col span={24}>
          <div className='label'>任务执行时间：</div>
          <div className='content'>{item.captureStartTime && item.captureEndTime && `${item.captureStartTime} ~ ${item.captureEndTime}`}</div>
        </Col>}
        <Col span={24}>
          <div className='label'>任务说明：</div>
          <div className='content'>{item.description}</div>
        </Col>
      </Row>
    </div>
  )
}
export default BasicInfoView