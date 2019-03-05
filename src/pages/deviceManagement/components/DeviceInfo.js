import React from 'react';
const getKeyValue = Dict.getLabel
class DeviceInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { info = {} } = this.props;
    return (
      <div className="device-info-layout">
        <h3 className="part-title">设备信息</h3>
        <div className="content-layout">
          <div className="content-item">
            <div>设备类型:</div>
            <div>{getKeyValue('deviceType', info.deviceType)}</div>
          </div>
          <div className="content-item">
            <div>设备型号:</div>
            <div>{info.extJson.cameraInfo.type}</div>
          </div>
          <div className="content-item">
            <div>设备品牌:</div>
            <div>{(info.extJson.cameraInfo.brand)|| '未知'}</div>
          </div>
          <div className="content-item">
            <div>SN码:</div>
            <div>{info.sn}</div>
          </div>
          <div className="content-item">
            <div>CID:</div>
            <div>{info.cid}</div>
          </div>
          <div className="content-item">
            <div>云台:</div>
            <div>{info.extJson.cameraInfo.platform === '1' ? '是' : '否'}</div>
          </div>
          {info.extJson.cameraInfo.storage&&<div className="content-item">
            <div>视频储存周期:</div>
            <div>{info.extJson.cameraInfo.storage.video}天</div>
          </div>}
          {info.extJson.cameraInfo.storage&&<div className="content-item">
            <div>图片储存周期:</div>
            <div>{info.extJson.cameraInfo.storage.picture}天</div>
          </div>}
        </div>
      </div>
    );
  }
}
export default DeviceInfo;