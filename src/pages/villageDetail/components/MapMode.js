import React from "react";
import { observer } from "mobx-react";
import * as _ from "lodash";
import { Spin, message } from "antd";

import "../style/baseInfo.less";

const CommunityBounds = Loader.loadBusinessComponent("CommunityBounds");

@Decorator.businessProvider("village", "device")
@observer
class MapMode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectPoints: [],
      initPoints: []
    };
  }
  //添加id
  addId = points => {
    points.forEach(v => {
      v.id = v.deviceId;
    });
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.villageData.placeId !== this.props.villageData.placeId) {
      this.props.placeSelect(nextProps.villageData.placeId)
    }
  }
  componentDidMount() {
    const { activeId, isAdd } = this.props;
    if(!isAdd){
      Service.community.assignedDevice({ids: [activeId]}).then(res => {
        if(!res.data){
          return
        }
      let initPoints = res.data.length > 0 ? res.data.filter(v => v.id == activeId)[0].devices : []
      this.addId(initPoints);
      this.setState({
        initPoints: _.cloneDeep(initPoints),
        selectPoints: initPoints
      });
    });}
  }
  click(point, event) {
    console.log('点击了图标')
    if(this.props.isAdd){
      message.warn('请先创建小区')
      return
    }
    const { selectPoints } = this.state;
    const index = selectPoints.findIndex(v => v.id === point.id);
    if (index > -1) {
      selectPoints.splice(index, 1);
    } else {
      selectPoints.push(point);
    }
    this.setState({ selectPoints }, () => this.saveDevices());
  }
  assignedList = points => {
    let { selectPoints } = this.state;
    let arr = [].concat(selectPoints, points);
    selectPoints = _.uniqBy(arr,'id')
    this.setState({ selectPoints }, () => this.saveDevices());
  };
  unAllotPoint = point => {
    const { selectPoints } = this.state;
    const index = selectPoints.findIndex(v => v.id === point.id);
    if (index > -1) {
      selectPoints.splice(index, 1);
      this.setState({ selectPoints }, () => this.saveDevices());
    }
  };

  saveDevices = () => {
    let { selectPoints, initPoints } = this.state;
    let { villageData, saveDeviceOption } = this.props;
    let selectPointss = selectPoints.map(v => v.id);
    let initPointss = initPoints.map(v => v.id);
    let bindPoints = _.difference(selectPointss, initPointss);
    let unBindPoints = _.difference(initPointss, selectPointss);
    // console.log('bindPoints',bindPoints)
    // console.log('unBindPoints',unBindPoints)
    let option = {
      id: villageData.id,
      assignDeviceIds: bindPoints,
      unAssignDeviceIds: unBindPoints
    };
    saveDeviceOption && saveDeviceOption(option);
  };

  render() {
    const { device, savePoints ,isAdd,polylineData,villageData} = this.props;
    const { selectPoints } = this.state;
    return (
      <React.Fragment>
        <div className="map-label">小区边界:</div>
        <CommunityBounds
          isAdd={isAdd}
          points={device.deviceArray}
          hideReset={true}
          village={isAdd ? polylineData : villageData}
          selectPoints={selectPoints}
          savePoints={savePoints}
          autoAssignedPints={this.assignedList}
          unAllotPoint={this.unAllotPoint}
          options={{ click: (...args) => this.click(...args) }}
        />
      </React.Fragment>
    );
  }
}
export default MapMode;
