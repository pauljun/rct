import React from 'react';
import { withRouter } from "react-router-dom";
const FrameCard = Loader.loadBusinessComponent("FrameCard");
const SimpleMap = Loader.loadBusinessComponent("MapComponent", "SimpleMap");
@withRouter
@Decorator.businessProvider("device", "tab")
class DevicePoint extends React.Component {
  goPage = (moduleName, data) => {
    this.props.tab.goPage({
      moduleName,
      location: this.props.location,
      data,
      isUpdate: false
    });
  };
  markerClick = id => {
    this.goPage("deviceFile", { id });
  };
  render() {
    let { nearDeviceList, point, device } = this.props;
    let cids = [];
    nearDeviceList.forEach(v => {
      if (point.cid !== v.cid) {
        cids.push(v.cid);
      }
    });
    let list = device.queryCameraListByIds(cids) || [];
    return (
      <FrameCard title="点位信息：">
        <div className="device-point-view">
          <SimpleMap
            zoom={16}
            id={point.cid}
            centerRadius={500}
            center={[point.longitude, point.latitude]}
            points={list}
            point={point}
            markerClick={this.markerClick}
          />
        </div>
      </FrameCard>
    );
  }
}

export default DevicePoint