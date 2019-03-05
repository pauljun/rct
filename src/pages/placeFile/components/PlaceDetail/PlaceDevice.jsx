import React from 'react';
import ItemTitleCon from "./ItemTitleCon";
import { withRouter } from "react-router-dom";
const { bigDatePlaceType } = Dict.map;
const FrameCard = Loader.loadBusinessComponent("FrameCard");
const SimpleMap = Loader.loadBusinessComponent('MapComponent', 'SimpleMap');
@withRouter
@Decorator.businessProvider('tab')
class PlaceDevice extends React.Component {
  getValue = label => {
    return bigDatePlaceType.find(v => {
      return v.label == label;
    }) && bigDatePlaceType.find(v => {
      return v.label == label;
    }).value;
  };
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
    let { placeTypeNum = {}, deviceList, placeInfo } = this.props;
    return (
      <FrameCard title="场所设备：">
        <div className="place-device-view">
          <SimpleMap
            points={deviceList}
            zoom={
              placeInfo.level===0?7:13}
            polyline={placeInfo.polyline}
            id={placeInfo.id}
            center={placeInfo.center && placeInfo.center.split(",")}
            markerClick={this.markerClick}
          >
            <div className="place-device-resources">
              <ItemTitleCon
                icon={"icon-Community_Dark1"}
                title={"小区"}
                con={placeTypeNum[this.getValue("小区")]}
              />
              <ItemTitleCon
                icon={"icon-School_Dark"}
                title={"学校"}
                con={placeTypeNum[this.getValue("学校")]}
              />
              <ItemTitleCon
                icon={"icon-InternetCafe_Dark"}
                title={"网吧"}
                con={placeTypeNum[this.getValue("网吧")]}
              />
              <ItemTitleCon
                icon={"icon-KTV_Dark"}
                title={"娱乐场所"}
                con={placeTypeNum[this.getValue("娱乐场所")]}
              />
              <ItemTitleCon
                icon={"icon-Other_Dark"}
                title={"其他"}
                con={placeTypeNum[this.getValue("其他")]}
              />
            </div>
          </SimpleMap>
        </div>
      </FrameCard>
    );
  }
}

export default PlaceDevice