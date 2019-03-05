import React from "react";
import ClusterMap from "./ClusterMap";
import {message} from 'antd'
import MoveableTimeChoise from '../../../pages/videoSurveillance/components/MoveableTimeChoise';
import _ from "lodash";

const { CommunityPolygon } = LMap;

class CommunityMap extends React.Component {
  constructor(props) {
    super(props);
    this.communityRef = React.createRef();
    this.timeChoiseRef = React.createRef();
    this.mapViewRef=React.createRef();
  }
  componentWillUnmount() {
    this.communityRef = null;
  }
  toggleTimeChoiseContent = (visible = true, clearTime = false) => {
    if (!visible) {
       this.timeChoiseRef.current.setDeviceInfo();
    }
    this.timeChoiseRef.current.setVisible(visible, clearTime);
  };
  clearSelectDevice = () => {
    // this.playerDatas = [];
    this.toggleTimeChoiseContent(false);
    // this.setState({ selectDevice: [], loopModalKey: Math.random() });
  };
  queryRealTimeAddressMulti = deviceList => {
    // TODO 历史视频选时控件状态检测

    // TODO 设备开流偏好设置
    const deviceInfos = deviceList.map(v => {
      const data = {
        cid: v.cid || v.id,
        deviceName: v.deviceName || v.name,
        deviceType: v.deviceType,
        flvStream: false
      };
      // ptzTypes.push(
      //   info.extJson &&
      //     info.extJson.cameraInfo &&
      //     info.extJson.cameraInfo.type
      // );
      return data;
    });
    return Service.video.queryRealTimeAddressMulti(deviceInfos);
  };
  handleHistoryVideo = async item => {
    if (!item.storageLimit) {
      const storageLimit = await this.getDeviceStorageLimit(item);
      item.storageLimit = storageLimit;
    }
    this.updateTimeChoiseDeviceInfo(item);
    this.toggleTimeChoiseContent();
  };
  updateTimeChoiseDeviceInfo = item => {
    this.timeChoiseRef.current.setDeviceInfo(_.cloneDeep(item));
  };
  // 查询设备存储周期
  getDeviceStorageLimit = item => {
    return Service.device
      .queryDeviceInfoByCid(item.cid)
      .then(result => {
        let storageLimit;
        try {
          storageLimit = +result.data.extJson.cameraInfo.storage.video || 7;
        } catch {
          storageLimit = 7;
        }
        return storageLimit;
      })
      .catch(e => 7);
  };
  jumpCommunity = id => {
    this.communityRef.current && this.communityRef.current.jumpCommunity(id);
  };
  submitHistoryTime = (options) => {
    const MAX_HISTORY_GAP = 7;
    if(options.startTime - options.endTime > 3600 * 24 * MAX_HISTORY_GAP) {
      return message.error(`历史视频查看不能超过${MAX_HISTORY_GAP}天`);
    }
    options.isLiving = false;
    const { deviceInfo } = this.timeChoiseRef.current.state;
    this.onSelectDevice(deviceInfo, options);
  }
  onSelectDevice = (item, options={isLiving: true}) => {
      this.mapViewRef.current.wrappedInstance.markerClick(item, options);
  };
  queryHistoryAddress = ({cid, startTime, endTime, deviceName}) => {
    const data = {
      cid, 
      deviceName,
      startTime, 
      endTime
    }
    return Service.video.queryHistoryAddress(data)
  }
  render() {
    const { children, points = [], villages = [] } = this.props;
    return (
      <ClusterMap
        points={points}
        closeVideo={this.clearSelectDevice}
        toggleTimeChoiseContent={this.toggleTimeChoiseContent}
        queryRealTimeAddressMulti={this.queryRealTimeAddressMulti}
        handleHistoryVideo={this.handleHistoryVideo}
        ref={this.mapViewRef}
        queryHistoryAddress={this.queryHistoryAddress}
        hasDownload={false}
        hasScreenshot={false}
        communityLayer={true}
        hoverContent={
          <div></div>
        }
      >
      <MoveableTimeChoise
        ref={this.timeChoiseRef}
        onOk={this.submitHistoryTime}
        toggleTimeChoiseContent={this.toggleTimeChoiseContent}
      />
        <CommunityPolygon villages={villages} ref={this.communityRef} />
        {children ? children : null}
      </ClusterMap>
    );
  }
}

export default CommunityMap;
