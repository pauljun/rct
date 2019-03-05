import React from 'react';
import ItemTitleCon from "./ItemTitleCon";
const FrameCard = Loader.loadBusinessComponent("FrameCard");
const InfoIconItemView = Loader.loadBusinessComponent("InfoIconItemView");
class DeviceInfo extends React.Component {
  render() { 
    let {data} = this.props
    let cameraInfo = (data.extJson && data.extJson.cameraInfo) || {}
    let extMap = (data.extJson && data.extJson.extMap) ||{}
    return <FrameCard title="设备信息：">
        <div className="device-info-view">
          <div className="device-info-content">
            <div className="device-info-content-box">
              <ItemTitleCon title='设备名称：' con={data.deviceName}/>
              <ItemTitleCon title='设备型号：' con={data.deviceModel}/>
              <ItemTitleCon title='云台：' con={cameraInfo.platform}/>
              <ItemTitleCon title='朝向：' con={extMap.cameraOrientation}/>
              <ItemTitleCon title='安装方式：' con={data.installationMethod}/>
            </div>
            <div className="device-info-content-box" >
              <ItemTitleCon title='SN码：' con={data.sn} />
              <ItemTitleCon title='设备品牌：' con={data.deviceBrand} />
              <ItemTitleCon title='视频存储周期：' con={cameraInfo.storage&&cameraInfo.storage.video} />
              <ItemTitleCon title='所属行业：' con={extMap.industry1} />
              <ItemTitleCon title='OSD：' con={cameraInfo.osd}/>
            </div>
            <div className="device-info-content-box" >
              <ItemTitleCon title='设备类型：' con={data.deviceType} />
              <ItemTitleCon title='CID码：' con={data.cid} />
              <ItemTitleCon title='进出方向：' con={extMap.inOutDirection} />
              <ItemTitleCon title='建设单位行业：' con={extMap.industry2} />
            </div>
          </div>
          <div className="device-info-data">
            <InfoIconItemView title={"出现人员"} icon={"icon-People_Dark"} num={data.personCount||0} />
            <InfoIconItemView title={"人脸资源"} icon={"icon-Face_Dark1"} num={data.faceCount||0} />
            <InfoIconItemView title={"人体资源"} icon={"icon-Body_Dark"} num={data.bodyCount||0} />
            <InfoIconItemView title={"机动车资源"} icon={"icon-Car_Dark"} num={data.motorVehicleCount||0} />
            {/* <InfoIconItemView title={"非机动车资源"} icon={"icon-NonMotor_Dark"} num={data.nonMotorVehicleCount||0} /> */}
          </div>
        </div>
      </FrameCard>; 
  }
}

export default DeviceInfo