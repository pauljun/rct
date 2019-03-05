import React from 'react';
const FrameCard = Loader.loadBusinessComponent("FrameCard");
const InfoIconItemView = Loader.loadBusinessComponent("InfoIconItemView");
class VisitorsFlowrate extends React.Component {
  render() {
    let { placeInfoData} = this.props
    return <FrameCard title="场所信息：">
        <div className="place-info-view">
          <div className="place-info-header">
            <p>{`场所编号：${placeInfoData.areaCode||''}`}</p>
            <p>{`场所名称：${placeInfoData.areaName||''}`}</p>
          </div>
          <div className="place-info-content">
          <InfoIconItemView title={"场所"} icon={"icon-Place_Dark"} num={(placeInfoData.placeNum&&placeInfoData.placeNum.total)||0} />
            <InfoIconItemView title={"设备"} icon={"icon-Device_Dark"} num={placeInfoData.deviceNum||0} />
            <InfoIconItemView title={"出现人员"} icon={"icon-People_Dark"} num={placeInfoData.personCount||0} />
            <InfoIconItemView title={"人脸资源"} icon={"icon-Face_Dark1"} num={placeInfoData.faceCount||0} />
            <InfoIconItemView title={"人体资源"} icon={"icon-Body_Dark"} num={placeInfoData.bodyCount||0} />
            <InfoIconItemView title={"机动车资源"} icon={"icon-Car_Dark"} num={placeInfoData.motorVehicleCount||0} />
            {/* <InfoIconItemView title={"非机动车资源"} icon={"icon-NonMotor_Dark"} num={placeInfoData.nonMotorVehicleCount||0} /> */}
          </div>
        </div>
      </FrameCard>; 
  }
}

export default VisitorsFlowrate