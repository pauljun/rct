/**
 * @author wwj
 * @createTime 2019-1-7
 */

import React, { Component } from 'react'
import { DatePicker,message, Radio } from 'antd'
import moment from 'moment'
import './index.less'
const RadioGroup = Radio.Group
const dateFormat = Shared.format.dataTime
const IconFont = Loader.loadBaseComponent('IconFont')

function getTimeRange(value){
  let endTime = new Date()*1
  let startTime = endTime
  if(value === 2){ // 自定义时间
    startTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
  }else if(value === 3){ // 3天
    startTime = new Date(moment().subtract(3,'d')).getTime()
  }else {
    startTime = endTime - value * 24 * 60 * 1000 * 60
  }
  return { startTime, endTime }
}

class TimeRadio extends Component{
  /**
   * @desc 禁选日期
   */
  disabledDate = (current) => {
    const value = new Date(current).valueOf()
    const timeNow=new Date().valueOf()
    const timeDiff=value-timeNow
    const dayDiff=Math.abs(Math.floor(timeDiff/86400000))
    return dayDiff > 30
  }
  /**
   * @desc 修改时间
   */
  onChange = (dateString, type) => {
    const { startTime, endTime} = this.props
    const value = new Date(dateString).valueOf()
    if (type === 'startTime') {
      if (endTime && value > endTime){
        message.warning('开始时间不能大于结束时间')
        return
      }
    }else{
      if (startTime && value < startTime) {
        message.warning('结束时间不能小于开始时间')
        return
      }
    }
    this.props.change({
      [type]: value
    }, false)
  }

  /**
   * @desc 点击确定
   */
  onOk = (options={}) => {
    const { onOk } = this.props
    onOk && onOk(options)
  }

  // 单选
  radioSelect = (e) => {
    let value = e.target.value
    const { change } = this.props
    const { startTime, endTime } = getTimeRange(value)
    change && change({
      timerTabsActive: value,
      startTime,
      endTime
    })
  }

  render(){
    let { label = '时间', startTime, endTime, value } = this.props
    if(value === 2){
      // 自定义
      startTime = moment(startTime).format(dateFormat)
      endTime = moment(endTime).format(dateFormat)
    }
    return (
      <div className='timer-wrapper'>
        <div className='search-title'>
          <IconFont 
						type="icon-Clock_Light"
          />
          {label}：
        </div>
        <div className='search-content'>
          <RadioGroup onChange={this.radioSelect} value={value}>
            <Radio value={1}>24小时</Radio>
            <Radio value={3}>3天</Radio>
            <Radio value={7}>7天</Radio>
            <Radio value={15}>15天</Radio>
            <Radio value={2}>自定义</Radio>
          </RadioGroup>
          {value === 2 && <div>
            <DatePicker
              disabledDate={this.disabledDate}
              showTime
              allowClear={false}
              format={dateFormat}
              placeholder='开始时间'
              onChange={(dateString) => this.onChange(dateString,'startTime')}
              onOk={() => this.onOk()}
              defaultValue={moment(startTime,dateFormat)}
              value={moment(startTime,dateFormat)}
            />
            <DatePicker
              disabledDate={this.disabledDate}
              showTime
              allowClear={false}
              format={dateFormat}
              placeholder='结束时间'
              onChange={(dateString) => this.onChange(dateString,'endTime')}
              onOk={() => this.onOk()}
              defaultValue={moment(endTime, dateFormat)}
              value={moment(endTime, dateFormat)}
            />
          </div>}
        </div>
      </div>
    )
  }
}

export default TimeRadio
