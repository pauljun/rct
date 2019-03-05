import React from 'react';
import VideoView from './VideoView';
import { message } from 'antd';
import { inject } from 'mobx-react';
import { cloneDeep } from 'lodash';

const { MapComponent, ClusterMarker, MapResetTools, InfoWindow } = LMap;
const { mj, zj, wifi } = Dict.map;

@inject('device')
class ClusterMap extends React.PureComponent {
  constructor(props) {
    super(props);
    this.clusterMarker = null;
    this.infoWindow = null;
    this.map = null;
    this.state = {
      info: null, // 视频fileData
      center: [0, 0],
      visible: false,
      key: Math.random()
    };
  }
  initMap = map => {
    this.map = map;
  };
  initClusterMarker = clusterMarker => {
    this.clusterMarker = clusterMarker;
    this.forceUpdate();
  };
  initInfoWindow = infoWindow => {
    this.infoWindow = infoWindow;
  };
  componentWillUnmount() {
    this.clusterMarker = null;
    this.infoWindow = null;
  }
  markerClick(data, options={}) {
    const { canPlay = true } = this.props;
    if (!canPlay) {
      return false;
    }
    // if (data.deviceType * 1 !== 103401) {
    //   return message.warning('当前设备不支持看视频！');
    // }
    if (!data.longitude || !data.latitude) {
      return message.warning('当前设备没有设置经纬度！');
    }
    options.isLiving = options.isLiving === undefined ? true : options.isLiving;
    this.setPlayMethods(options, data);
  }

  // 播放历史或实时流
  setPlayMethods = async (options, info) => {
    info = info ? info : cloneDeep(this.state.info);
    const { isLiving, startTime, endTime } = options;
    const position = [info.longitude, info.latitude];
    if (!isLiving) {
      // 历史
      const { queryHistoryAddress } = this.props;
      const res = await queryHistoryAddress({ cid: info.cid, startTime, endTime });
      info.isLiving = false;
      info.historyList = res;
    } else {
      info.isLiving = true;
      info.historyList = undefined;
      const { toggleTimeChoiseContent, queryRealTimeAddressMulti } = this.props;
      toggleTimeChoiseContent(false);
      if(info.file) {
        // 已经保存过实时视频的地址，直接播放
      } else {
        const fileDatas = await queryRealTimeAddressMulti([info]);
        info.file = fileDatas[0].file;
      }
    }
    this.setState({
      info,
      center: position,
      visible: true,
      key: Math.random()
    });
  }

  // 处理播放器上历史实时切换按钮
  handleVideoSwitch = (options, isHistory) => {
    if(!isHistory) {
      this.setPlayMethods(options)
    } else {
      this.props.handleHistoryVideo(options);
    }
  }

  handleRectSearch = (status) => {
    const { info } = this.state;
    this.setState({
      info: Object.assign({}, info, { rectSearchStatus: status })
    })
  }

  closeVideo() {
    this.setState({ visible: false, info: {} });
    this.props.closeVideo();
  }

  render() {
    const { device, children, points, hasVideo = true, hoverContent, markerMouseover, markerMouseout,hasDownload=true,hasScreenshot=true,communityLayer=false } = this.props;
    const { info, center, visible, key } = this.state;
    return (
      <MapComponent initMap={this.initMap}>
        <ClusterMarker
          options={{
            click: this.markerClick.bind(this),
            hoverContent,
            mouseover: markerMouseover,
            mouseout: markerMouseout
          }}
          filterResource={true}
          excludeTypes={communityLayer?[wifi.value]:[ mj.value, zj.value, wifi.value]}
          points={points ? points : device.deviceArray}
          init={this.initClusterMarker}
        />
        {hasVideo && (
          <InfoWindow
            visible={visible}
            center={center}
            init={this.initInfoWindow}
            content={
              <VideoView
                info={info}
                key={key}
                closeVideo={() => this.closeVideo()}
                setPlayMethods={this.handleVideoSwitch}
                hasDownload={hasDownload}
                hasScreenshot={hasScreenshot}
                // handleRectSearch={this.handleRectSearch}
                handleRectSearch={false}
              />
            }
          />
        )}
       <MapResetTools />
        {children &&
          React.Children.map(children, child =>
            React.isValidElement(child)
              ? React.cloneElement(child, { clusterMarker: this.clusterMarker })
              : child
          )}
      </MapComponent>
    );
  }
}

export default ClusterMap;
