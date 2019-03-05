import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import MapMode from "./MapMode";
import EditForm from "./editForm";
import "../style/baseInfo.less";

@withRouter
@Decorator.businessProvider("tab", "device", "user")
@observer
class BaseInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      mapData: [],
      deviceOption: {},
      placeArr: [],
      polylineData: {}
    };
  }
  componentDidMount() {
    let { user } = this.props;
    Service.organization
      .queryPlacesByOrganizationId(user.userInfo.organizationId)
      .then(res => {
        if (res.code === 200 || res.code === 200000) {
          this.setState({ placeArr: res.data.length > 0 ? res.data.filter(v => v && v.level > 4) : [] });
        }
      });
  }
  //选择场所
  placeSelect = value => {
    Service.place.placesExt({ id: value }).then(res => {
      if (res.code === 200 || res.code === 200000) {
        let polyline = [];
        if (res.data && res.data.polyline) {
          polyline = JSON.stringify(
            res.data.polyline.split(";").map(v => v.split(",").map(x => x * 1))
          );
        }
        this.setState({
          polylineData: { polyline, id: res.data ? res.data.id : "" }
        });
      }
    });
  };
  savePoints = option => {
    this.setState({ mapData: option });
  };
  saveDeviceOption = option => {
    this.setState({ deviceOption: option });
  };
  // 取消操作
  handleCancel = () => {
    SocketEmitter.emit(SocketEmitter.eventName.updateVillageList);
    SocketEmitter.emit(SocketEmitter.eventName.villageCloseDraw);
    this.props.tab.closeCurrentTab({
      location: this.props.location
    });
  };
  render() {
    let { isAdd, initData, activeId } = this.props;
    let { mapData, deviceOption, placeArr, polylineData } = this.state;
    return (
      <div className="VD-base">
        <EditForm
          isAdd={isAdd}
          placeArr={placeArr}
          polylineData={polylineData}
          placeSelect={this.placeSelect}
          initData={initData}
          deviceOption={deviceOption}
          mapData={mapData}
          handleCancel={this.handleCancel}
        />
        <div className="edit-village-map">
          <MapMode
            key={"baseMap"}
            isAdd={isAdd}
            activeId={activeId}
            villageData={initData}
            placeSelect={this.placeSelect}
            polylineData={polylineData}
            savePoints={this.savePoints}
            saveDeviceOption={this.saveDeviceOption}
          />
        </div>
      </div>
    );
  }
}
export default BaseInfo;
