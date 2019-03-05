import React, { Component } from 'react';
import { Button } from 'antd';
import moment from 'moment';
import { videoContext } from '../moduleContext';
import '../style/moveableTimeChoise.less';

const MoveContent = Loader.loadBaseComponent('MoveContent');
const RangePicker = Loader.loadBaseComponent('RangePicker')

@videoContext
class MoveableTimeChoise extends Component {
  state={
    visible: false,
    startTime: null, // 毫秒级
    endTime: null,
    deviceInfo: {}, // 保存设备信息
  }

  // TODO 比较存储周期确定时间范围
  compareStorageLimit = (storageLimit) => {
    let { deviceInfo, startTime, endTime } = this.state;
    if(storageLimit < deviceInfo.storageLimit) {
      const minDate = moment().subtract(storageLimit, 'd')*1;
      if(endTime < minDate) {
        startTime = moment().subtract(1,'h')*1;
        endTime = moment()*1
      } 
      if(endTime > minDate && startTime < minDate) {
        startTime = minDate
      } 
    }
    return { startTime, endTime }
  }


  // 设置新的设备信息和时间
  setDeviceInfo = (newDeviceInfo={}) => {
    const storageLimit = newDeviceInfo.storageLimit;
    let { startTime, endTime } = this.compareStorageLimit(storageLimit);
    if(newDeviceInfo.historyList) {
      const { beginDate, duration } = newDeviceInfo.historyList;
      startTime = moment(beginDate)*1;
      endTime = duration + moment(beginDate)*1;
    }
    this.setState({
      startTime, 
      endTime,
      deviceInfo: newDeviceInfo
    });
  }
  // 设置显隐状态和时间
  setVisible = (visible=true, clearTime=false) => {
    if(visible === this.state.visible) {
      return 
    }
    const state = { visible };
    if(!this.state.startTime) {
      state.startTime = moment().subtract(1,'h')*1;
      state.endTime = moment()*1;
    }
    if(clearTime) {
      state.startTime = null
      state.endTime = null
    } 
    this.setState(state);
  }
  onCancel = () => {
    this.props.toggleTimeChoiseContent(false)
  }
  // 时间选中
  onSubmit = () => {
    const { startTime, endTime } = this.state;
    const stringStartTime = moment(startTime).format('X');
    const stringEndTime = moment(endTime).format('X');
    this.props.onOk({ 
      startTime: stringStartTime, 
      endTime: stringEndTime
    })
  }

  handleTimeChange = (type, value) => {
    this.setState({
      [type]: value
    })
  }

  render() {
    const { visible, startTime, endTime, deviceInfo } = this.state;
    if(!visible) {
      return null
    }
    return (
      <MoveContent
        className='moveable-time-choise' 
        size={{ width: '348px', height: '260px' }}
        moveBar={
          <div>
            历史播放时间
            <span className='tip'>
              提示：可灵活拖动
            </span>
          </div>
        }
      >
        <div className='time-choise-content'>
          <div className='device-name'>
            { deviceInfo.deviceName }
          </div>
          <RangePicker
            startTime={startTime}
            endTime={endTime}
            maxDate={true}
            minDate={-deviceInfo.storageLimit}
            startLabel='从: '
            endLabel='到: '
            divider={false}
            onChange={this.handleTimeChange}
          />
        </div>
        <div className='time-choise-footer'>
          <Button onClick={this.onCancel}>取消</Button>
          <Button
            onClick={this.onSubmit}
            htmlType="submit"
            type="primary"
          >
            确定
          </Button>
        </div>
      </MoveContent>
    )
  }
}
export default MoveableTimeChoise;