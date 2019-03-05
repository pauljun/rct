import React from "react";
import AllotDevice from "./component/AllotDevice";
import PropTypes from "prop-types";
import "./index.less";
import { Button, message } from "antd";
import * as _ from 'lodash'

const {
  MapComponent,
  CommunityPolygon,
  MapResetTools,
  MouseTool
} = LMap;
const IconFont = Loader.loadBaseComponent("IconFont");
const DeviceList = Loader.loadBusinessComponent("DeviceList");
const SelectPoi = Loader.loadBusinessComponent("SelectPoi");

class CommunityBounds extends React.Component {
  static propTypes = {
    points: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.object,
    village: PropTypes.object.isRequired,
    autoAssignedPints: PropTypes.func.isRequired,
    selectPoints: PropTypes.arrayOf(PropTypes.object).isRequired,
    unAllotPoint: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.communityRef = React.createRef();
    this.clusterMarker = null;
    SocketEmitter.on(SocketEmitter.eventName.villageCloseDraw, this.clearDraw);
    this.map = null;
    this.communityMap = null;
    this.state = {
      mapSelectPoints: [],
      rangeCoordinates: [],
      onDraw: false,
      adressArr: [],
      insidePints:[]
    };
  }
  time = false
  componentWillUnmount() {
    SocketEmitter.off(SocketEmitter.eventName.villageCloseDraw, this.clearDraw);
    this.map = null;
    this.clusterMarker = null;
    this.mouseTool = null;
    this.time = null
  }
  initMap = map => {
    this.map = map;
  };
  initMouseTools(mouseTool) {
    this.mouseTool = mouseTool;
  }
  /*小区边界内设备自动分配*/
  autoAssignedPints = () => {
    const { village, points, autoAssignedPints ,selectPoints} = this.props;
    if (village.polyline === "") {
      message.warn("暂无边界，不可一键分配");
      return;
    }
    const polygon = this.communityRef.current.getPolygon(village.id);
    let insidePints = this.map.computedPointsInArea(points, polygon.getPath());
    if(_.difference(insidePints.map(v => v.id),selectPoints.map(v => v.id)).length > 0){
      autoAssignedPints && autoAssignedPints(insidePints);
    }else{
      message.warn("小区内所有设备已分配");
    }
  };
  /*跳回小区边界*/
  jumpCommunity = () => {
    let { village } = this.props;
    this.communityRef.current.jumpCommunity(village.id);
  };
  /*开始绘制*/
  startDrawPolygon() {
    this.setState({ onDraw: true });
    const { mapMethods } = this.mouseTool.props;
    this.cursor = mapMethods.getDefaultCursor();
    mapMethods.setDefaultCursor("crosshair");
    this.mouseTool.polygon();
  }
  /*结束绘制*/
  drawEnd(path) {
    const { mapMethods } = this.mouseTool.props;
    this.mouseTool.close();
    mapMethods.setDefaultCursor(this.cursor);
    //rangeCoordinates: "[[115.841591,28.677649],[115.843484,28.676774],[115.844324,28.676327],[115.845024,28.677541],[115.844844,28.677645],[115.844957,28.677878],[115.843951,28.678311],[115.842588,28.678868],[115.842272,28.678209],[115.84195,28.678358],[115.841591,28.677649]]"
    let points = [];
    path.map(v => {
      points.push([v.lng, v.lat]);
    });
    this.props.savePoints && this.props.savePoints(points);
    this.setState({ rangeCoordinates: points });
  }
  /*清除绘制*/
  clearDraw = () => {
    if (this.state.onDraw) {
      this.mouseTool.close(true);
      this.setState({ rangeCoordinates: [], onDraw: false });
    }
  };
  
  /*绘制工具*/
  renderMapTool = () => {
    let { onDraw } = this.state;
    return onDraw ? (
      <Button className="village-tools-draw" onClick={() => this.clearDraw()}>
        <IconFont type="icon-Close_Main1" theme="outlined" />
        清除绘制
      </Button>
    ) : (
      <Button
        className="village-tools-draw"
        onClick={() => this.startDrawPolygon()}
      >
        <IconFont type="icon-Choose__Main2" theme="outlined" />
        绘制边界
      </Button>
    );
  };
  componentDidMount(){
    setTimeout(() => {
      this.time = true
      this.forceUpdate()
    },500)
  }
  render() {
    const {
      points,
      options,
      selectPoints,
      village = {},
      unAllotPoint,
      hideReset,
      filterResource,
      isAdd,
    } = this.props;
    return (
      <MapComponent className="CommunityBounds-map" initMap={this.initMap}>
        <SelectPoi map={this.map} />
        {this.time && <AllotDevice
          points={points}
          options={options}
          selectPoints={selectPoints}
          filterResource={filterResource}
        />}
        <CommunityPolygon
          ref={this.communityRef}
          villages={[village]}
          currentId={village.id}
        />
        {this.renderMapTool()}
        {!isAdd && (
          <Button className="auto-assgind-btn" onClick={this.autoAssignedPints}>
            <IconFont type="icon-Allocation_One_Main" /> 一键分配小区内所有设备
          </Button>
        )}
        <MouseTool
          init={mouseTool => this.initMouseTools(mouseTool)}
          drawEnd={path => this.drawEnd(path)}
        />
        <MapResetTools hideReset={hideReset} click={this.jumpCommunity} />
        {selectPoints.length !== 0 && (
          <DeviceList
            deviceList={selectPoints}
            selectDeviceList={selectPoints}
            checkable={false}
            deleteDeviceItem={unAllotPoint}
            title={
              <span>
                已关联设备
                <span className="map-device-list">({selectPoints.length})</span>
                个
              </span>
            }
          />
        )}
      </MapComponent>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <CommunityBounds {...props} forwardRef={ref} />
));
