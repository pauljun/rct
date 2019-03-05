/**
 * @author wwj
 * @createTime 2019-1-7
 */

import React, { Component } from 'react'
import { Button } from 'antd'
import './index.less'
const AutoSizer = Loader.loadModuleComponent('ReactVirtualized', 'AutoSizer')
const List = Loader.loadModuleComponent('ReactVirtualized', 'List')
const MapSelectModal = Loader.loadBusinessComponent('ModalSelectMap')
const OrgSelectModal = Loader.loadBusinessComponent('ModalTreeSelectCamera')
const DeviceIcon = Loader.loadBaseComponent('DeviceIcon')
const IconFont = Loader.loadBaseComponent('IconFont')

@Decorator.businessProvider('device')
class GrapPoint extends Component {
  state = {
    modalShow: false,
    keyMath: Math.random(),
    modalType: false
  }

  /**确定 */
  handleOk = (selectList) => {
    const { onChange, name } = this.props
    onChange && onChange({ [name || 'cameraIds']: selectList })
    this.handleCancel()
  }

  // 清空默认选中选择设备
  clearDevices = () => {
    const { onChange, name } = this.props
    onChange && onChange({ [name || 'cameraIds']: [] })
  }

  /**取消 */
  handleCancel = () => {
    this.setState({
      modalShow: false,
      keyMath: Math.random(),
      modalType: false
    })
  }

  showDeviceSelect = (modalType) => {
    this.setState({
      modalShow: true,
      modalType,
    })
  }

  // 渲染列表项
  rowRender = ({ key, index, style }) => {
    let v = this.props.selectList[index]
    return (
      <div style={style} key={v.id} title={v.deviceName} className='li'>
        <DeviceIcon
          type={v.deviceType}
          status={v.deviceStatus}
        />
        {v.deviceName}
      </div>
    )
  }

  render() {
    const { label = '点位', selectList = [] } = this.props
    const points = this.props.device.cameraArray.filter(v => v.deviceType !== Dict.map.db.value)
    const { modalType } = this.state
    return (
      <div className='point-select-wrapper'>
        <div className='search-title'>
          <IconFont
            type="icon-Add_Main"
          />
          {label}：
        </div>
        <div className='search-content'>
          <div className='clearfix'>
            <Button 
              className='fl'
              onClick={() => this.showDeviceSelect(1)}
            >
              <IconFont type="icon-List_Tree_Main" />
              列表模式
            </Button>
            <Button 
              className='fr' 
              onClick={() => this.showDeviceSelect(2)}
            >
              <IconFont type="icon-List_Map_Main" />
              地图模式
            </Button>
          </div>
          {!!selectList.length && (
            <div className='grap-point-content'>
              <div className='camera-selected'>
                <AutoSizer>
                  {({ width, height }) => (
                    <List
                      width={width}
                      height={height}
                      rowCount={selectList.length}
                      rowHeight={24}
                      key={this.state.keyMath}
                      rowRenderer={this.rowRender}
                    />
                  )}
                </AutoSizer>
              </div>
              <div className='clear' onClick={this.clearDevices}>
                <IconFont
                  type="icon-Delete_Main"
                  className="data-repository-icon" 
                />
                  清空摄像机
                </div>
            </div>
          )}
        </div>
        { modalType && ( modalType === 2 
            ? <MapSelectModal
                title={'抓拍点位'}
                width={920}
                points={points}
                className='point-select-map'
                visible={this.state.modalShow}
                onOk={this.handleOk}
                onCancel={this.handleCancel} 
                selectList={selectList}
              />
            : <OrgSelectModal 
                title='抓拍点位'
                visible={this.state.modalShow}
                onOk={this.handleOk}
                onCancel={this.handleCancel} 
                selectList={selectList} 
                hasSolidier={false}
              />)
        }
      </div>
    )
  }
}

export default GrapPoint
