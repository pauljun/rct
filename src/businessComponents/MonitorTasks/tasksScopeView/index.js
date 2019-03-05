import React, { Component } from 'react'
import DeviceViewBtn from '../components/deviceSelectBtn/index.js'
const Pagination = Loader.loadBaseComponent('Pagination')
const DeviceIcon = Loader.loadBaseComponent('DeviceIcon')
const ClusterMap = Loader.loadModuleComponent('MapComponent', 'ClusterMap')
export default class TasksScopeView extends Component {
  state = {
    type: 1,
    devices: [],
    deviceNow: [], // 当前渲染的数据
    pageSize: 60,
    total: 0,
    current: 1,
    pageSizeOptions: ['60','120','180'] // 分页配置
  }

  componentDidMount(){
    let devices = this.props.item.deviceIds || []
    let deviceNow = devices.slice(0, 60)
    this.setState({
      devices,
      total: devices.length,
      deviceNow
    })
  }

  componentWillReceiveProps(nextprops){
    if(nextprops.item.deviceIds !== this.props.item.deviceIds){
      let devices = nextprops.item.deviceIds || []
      let deviceNow = devices.slice(0, 60)
      this.setState({
        devices,
        total: devices.length,
        deviceNow
      })
    }
  }

  changeType = (type) => {
    if(this.state.type !== type){
      this.setState({type})
    }
  }

  change = (page, pageSize) => {
  // 前端分页处理
    let devices = this.state.devices
    let deviceNow = devices.slice((page - 1) * pageSize, page * pageSize)
    this.setState({
      current: page,
      pageSize,
      deviceNow
    })
  }
  
  render(){
    const { devices, pageSize, total, current, pageSizeOptions, deviceNow } = this.state
    return (
      <div className="tasks-scope-view info-view">
        <DeviceViewBtn 
          type={this.state.type}
          changeType={this.changeType}
        />
        <div className="content">
          {this.state.type === 1 ? 
            <div className="map-show">
              <ClusterMap 
                points={devices}
              />
            </div>:
            <div className="device-list">
              <div className="list">
                {deviceNow.map(item => {
                  return <span key={item.id} title={item.name}>
                     <DeviceIcon 
                      type={item.deviceType}
                      status={item.deviceStatus}
                    /> 
                    {item.deviceName}
                    </span>
                })}
              </div>
              {devices.length > 60 && <div className="device-pagination">
                <Pagination 
                  total={total}
                  pageSize={pageSize}
                  current={current}
                  pageSizeOptions={pageSizeOptions}
                  onChange={this.change}
                />
              </div>}
            </div>
          }
        </div>
      </div>
    )
  }
}