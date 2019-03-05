import React from 'react'
import './index.less'
import PlaceTree from '../List/place'
import DeviceView from './components/device'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'

const SelectMap = Loader.loadBusinessComponent('MapComponent', 'SelectMap')
/**过滤单兵 */
const getDeviceTypes = () => {
  let ids = Dict.map.deviceType.filter(v => v.value !== '-1' && v.value !== Dict.map.db.value)
  return _.flatten(ids.map(v => v.value.split(',')))
}

@withRouter
class MapView extends React.Component {
  state = {
    list: [],
    points: [],
    placeIds: []
  }
  componentWillMount(){
    this.queryDeivces()
  }
  /**框选 */
  onChange = (data, update = false) => {
    let placeIds = []
    data.list.map(v => placeIds.push(v.placeIds))
    this.setState({
      list: data.list,
      placeIds: [...new Set(_.flatten(placeIds))]
    })
    if(update){
      this.queryDeivces()
    }
  }

  /**清除选中 */
  cancelSelect = () => {
    this.setState({
      placeIds: []
    })
  }

  /**获取未分配设备列表 */
  queryDeivces = () => {
    Service.device.queryDevicesByOperationCenter({
      offset: 0,
      limit: 100000,
      distributionState: 2,
      deviceTypes: getDeviceTypes(),
      operationCenterId: Utils.queryFormat(this.props.location.search).id,
    }).then(res => {
      this.setState({
        points: res.data.list
      })
    })
  }
  render(){
    const { list, placeIds, points } = this.state
    return(
      <div className='operation-device-map'>
        <div className='map-container'>
          <SelectMap 
            onChange={this.onChange}
            selectList={list}
            points={points}
          />
        </div>
        <div className='rect-container'>
          <div className='h3'>分配场所:</div>
          <div className='container'>
            <PlaceTree 
              placeIds={placeIds}
              cancelSelect={this.cancelSelect}
            />
          </div>
          <div className='h3'>分配设备:</div>
          <DeviceView 
            selectList={list}
            onChange={this.onChange}
          />
        </div>
      </div>
    )
  }
}

export default MapView