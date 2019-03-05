/*
 * @Author: welson 
 * @Date: 2019-02-22 11:44:36 
 * @Last Modified by: welson
 * @Last Modified time: 2019-02-22 18:04:55
 */

 /**
  * 点位标注 + 场所查询
  */
import React from 'react';
import { Radio, message } from "antd";

import "./index.less";
import { async } from 'q';

const ModalComponent = Loader.loadBaseComponent('ModalComponent');
const SetPointMap = Loader.loadBusinessComponent('MapComponent', 'SetPointMap');
const { InfoWindow } = LMap;

const RadioGroup = Radio.Group;

class ModalSetPointMap extends React.Component {
  state = {
    infoWindowVisible: false,
    center: null,
    exitPlaces: [], 
    newPlaces: [],
    selectPlaceId: null,
    disabled: true
  };

  /**
   * 查找点位的新场所
   * 
  */
  getPlaces = async (position) => {
    const { point } = this.props;
    let placeIds=[]
    await Service.device.queryDeviceInfo(point.id)
    .then(res => {
      placeIds=res.data&&res.data.placeIds
    })
    const options = {
      center: position.join(','),
      cid: +point.cid
    }
    Service.place.queryPOIByCenter(options).then(res => {
      const { systemExistPlaces, systemNotExistPlaces } = res.data;
      const exitPlaces = systemExistPlaces;
      const newPlaces = systemNotExistPlaces;
      let selectPlaceId = null;
      if(exitPlaces.length){
        selectPlaceId = placeIds&&placeIds.find(v => !!exitPlaces.find(x => x.placeId == v))
      }
      this.setState({
        selectPlaceId,
        newPlaces,
        exitPlaces
      })
    })
  }

  handleCancel = (error) => {
    const { onCancel } = this.props;
    this.pointInfo = null;
    this.setState({
      infoWindowVisible: false,
      center: null,
      exitPlaces: [], 
      newPlaces: [],
      selectPlaceId: null,
      disabled: true
    })
    onCancel && onCancel(error);
  }

  handleSubmit = () => {
    const { newPlaces, exitPlaces, selectPlaceId } = this.state;
    const { address, name, id, cid, latitude, longitude } = this.pointInfo;
    const updateGeoOpions={
      address,
      name,
      id,
      latitude,
      longitude
    }
    const promiseList = [Service.device.updateDeviceGeo(updateGeoOpions)];
    const allPlaces = [].concat(newPlaces, exitPlaces);
    const selectPlaceInfo = allPlaces.find(v => v.id === selectPlaceId || v.placeId === selectPlaceId);
    if(selectPlaceInfo) {
      const updatePlaceOptions = {
        cid,
        id: selectPlaceInfo.id,
        placeId: selectPlaceInfo.placeId,
        towncode: selectPlaceInfo.towncode
      }
      promiseList.push(Service.place.activeAssociatedDeviceToPlace(updatePlaceOptions))
    }
    Promise.all(promiseList).then(() => {
      const { onOk } = this.props;
      message.success('操作成功！');
      onOk && onOk();
    }).catch(() => {
      message.error('操作失败！')
      this.handleCancel(false);
    })
  };

  /**
   * @desc 点位拖拽后的回调
   */
  handleChangePoint = ({ point, position }) => {
    const { showPlaceModal } = this.props;
    this.pointInfo = point;
    if(showPlaceModal) {
      this.getPlaces(position)
      // 拖动点位显示该点位的相关弹窗
      this.setState({
        infoWindowVisible: true,
        center: position
      })
    }
    this.setState({
      disabled: false
    })
  }

  // 修改设备关联场所
  handlePlaceChange = (e) => {
    const selectPlaceId = e.target.value;
    this.setState({
      selectPlaceId,
    })
  }
  
  renderPlace = () => {
    const { selectPlaceId, exitPlaces, newPlaces } = this.state;
    if(!exitPlaces.legnth && !newPlaces.length) {
      return null
    }
    return (
      <div className='points-new-exist-place'>
        <RadioGroup 
          className='new-place' 
          onChange={this.handlePlaceChange} 
          value={selectPlaceId}
        >
          {!!exitPlaces.length && (
            <div>
              <span> 已有场所： </span>
              {exitPlaces.map(items => (
                <Radio value={items.placeId}>{items.name}</Radio>
              ))}
            </div>
          )}
          {!!newPlaces.length && (
              <div>
                <span> 新获取场所： </span>
                {newPlaces.map(items => (
                  <Radio value={items.id}>{items.name}</Radio>
                ))}
              </div>
          )} 
        </RadioGroup>
      </div>
    )
  }

  render() {
    const { className='', point, onOk, showPlaceModal=false, showSearch, ...props } = this.props;
    const { infoWindowVisible, center, disabled }=this.state;
    return (
      <ModalComponent 
        className={`device-point-modal-wrapper ${className}`}
        okButtonProps={{
          disabled
        }}
        width='50%'
        height='70%'
        {...props} 
        onCancel={this.handleCancel}
        onOk={this.handleSubmit}
      >
        <SetPointMap 
          onChangePoint={this.handleChangePoint} 
          point={point} 
          showSearch
        >
          <InfoWindow
            visible={infoWindowVisible}
            center={center}
            content={this.renderPlace()}
          />
        </SetPointMap>
      </ModalComponent>
    );
  }
}

export default ModalSetPointMap;
