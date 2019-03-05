import React from 'react'
import moment from 'moment'
import './header.less'
const { vehicleColor, plateColor } = Dict.map
const HeaderVehicle = ({ item = {} }) => {
  /*机动车颜色vehicleColor 车牌颜色plateColor*/
  let vehicleC='', plateC='';
  if(item.vehicleColor){
    const vehicleColorItem = vehicleColor.find(v => v.value*1 === item.vehicleColor*1) || {};
    vehicleC = vehicleColorItem.text || '';
  }
  if(item.plateColor){
    const plateColorItem = plateColor.find(v => v.value*1 === item.plateColor*1) || {};
    plateC = plateColorItem.text || '';
  }
  const plateNo = item.plateNo === "无车牌" ? '-' : item.plateNo;
  return(
    <div className='data-repository-vehicle'>
      <div className="detail-item">
        <div className="item">
          车牌颜色 :
          <span>{plateC || '-'}</span>
        </div>
        <div className="item">
          机动车颜色 :
          <span>{vehicleC || '-'}</span>
        </div>
        <div className="item">
          车牌号码 :
          <span>{plateNo || '-'}</span>
        </div>
      </div>
      <div className="detail-item">
        <div className="item">
          通行时间 :
          <span>{moment(parseInt(item.captureTime, 10)).format(Shared.format.dataTime) || '-'}</span>
        </div>
        <div className="item">
          通过设备 :
          <span>{item.deviceName ? item.deviceName : '-'}</span>
        </div>
        <div className="item">
        </div>
      </div>
    </div>
  )
}
export default HeaderVehicle