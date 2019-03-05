import React from 'react'
import './index.less'
import { Button } from 'antd'
import DeviceView from './device'
import PlaceView from './place'

const IconFont = Loader.loadBaseComponent('IconFont');


class OperationCenterDevice extends React.Component {
  state = {
    isDeviceModel: false,
    placeIds: []
  }
  setType = () => {
    this.setState({isDeviceModel: !this.state.isDeviceModel})
  }
  setPlaceIds = placeIds => {
    this.setState({
      placeIds
    })
  }
  render(){
    const { isDeviceModel, placeIds } = this.state
    return (
      <React.Fragment>
        <div className='change-model-container'>
          <Button 
            onClick={this.setType}
            type={isDeviceModel && 'primary'}
          >
            <IconFont 
              type='icon-_Video'
            />
            分配设备
          </Button>
          <Button
            onClick={this.setType}
            type={!isDeviceModel && 'primary'}
          >
            <IconFont 
              type='icon-Place_Dark' 
            />
            分配场所
          </Button>
        </div>
        {isDeviceModel ? 
          <DeviceView 
            setPlaceIds={this.setPlaceIds}
          /> : 
          <PlaceView 
            placeIds={placeIds}
          />
        }
      </React.Fragment>
    )
  }
}

export default OperationCenterDevice