import React from 'react';
import DrawTools from './DrawTools';
import { inject } from 'mobx-react';
import { Modal } from 'antd';
import * as _ from 'lodash';

import '../style/select-map.scss';

const confirm = Modal.confirm;
const DeviceList = Loader.loadBusinessComponent('ListComponent');
const {
  MouseTool,
  ClusterMarker,
  MapResetTools,
  mapContext,
  providerMap
} = LMap;

@inject('device')
@providerMap('map-select-layout')
@mapContext.map
class SelectMap extends React.Component {
  constructor(props) {
    super(props);
    this.clusterMarker = null;
    this.mouseTool = null;
    this.cursor = null;
    this.modifyList = [];
  }
  componentWillUnmount() {
    this.clusterMarker = null;
    this.mouseTool = null;
    this.cursor = null;
  }
  initClusterMarker = clusterMarker => {
    this.clusterMarker = clusterMarker;
    this.forceUpdate();
  };

  initMouseTools = mouseTool => {
    this.mouseTool = mouseTool;
  };

  startDrawRect() {
    const { mapMethods } = this.props;
    this.cursor = mapMethods.getDefaultCursor();
    mapMethods.setDefaultCursor('crosshair');
    this.mouseTool.rectangle();
  }
  startDrawCircle() {
    const { mapMethods } = this.props;
    this.cursor = mapMethods.getDefaultCursor();
    mapMethods.setDefaultCursor('crosshair');
    this.mouseTool.circle();
  }
  startDrawPolygon() {
    const { mapMethods } = this.props;
    this.cursor = mapMethods.getDefaultCursor();
    mapMethods.setDefaultCursor('crosshair');
    this.mouseTool.polygon();
  }

  drawEnd = (path, isCircle) => {
    const { mapMethods } = this.props;
    const { selectList = [] } = this.props;
    const allPoints = this.clusterMarker.getAllPoints();
    this.mouseTool.close();
    mapMethods.setDefaultCursor(this.cursor);
    let points = [];
    if (isCircle) {
      points = mapMethods.computedPointsInCircle(
        allPoints,
        path.center,
        path.radius
      );
    } else {
      points = mapMethods.computedPointsInArea(allPoints, path);
    }

    const list = _.uniqBy([...points, ...selectList], 'id');
    this.modifyList = _.uniqBy(
      this.modifyList.concat(_.difference(points, selectList)),
      'id'
    );
    this.props.onChange && this.props.onChange({ list });
  };

  
  clearDraw = () => {
    const { clearConfirm = false } = this.props;
    const drawList = _.difference(this.props.selectList, this.modifyList);
    if (!clearConfirm) {
      this.mouseTool.close(true);
      this.props.onChange && this.props.onChange({ list: drawList });
      return;
    }
    confirm({
      title: '是否确定清除选中设备?',
      onOk: () => {
        this.mouseTool.close(true);
        this.props.onChange && this.props.onChange({ list: drawList });
      }
    });
  };

  /**
   * 列表操作导致select改变
   */
  listChange = ({ list, changeAll, flag }) => {
    const { onChange, clearConfirm = false } = this.props;
    if (!changeAll) {
      onChange({ list });
      return;
    }
    if (clearConfirm) {
      !flag &&
        confirm({
          title: '是否确定清除所有选中设备?',
          onOk: () => {
            this.mouseTool.close(true);
            onChange({ list: [] });
          }
        });
    } else {
      !flag && (this.mouseTool.close(true), onChange({ list: [] }));
    }
  };

  render() {
    const { device, selectList = [], points, title } = this.props;
    return (
      <React.Fragment>
        <ClusterMarker
          points={points ? points : device.deviceArray}
          init={this.initClusterMarker}
        />
        <DrawTools
          startDrawRect={this.startDrawRect.bind(this)}
          startDrawCircle={this.startDrawCircle.bind(this)}
          startDrawPolygon={this.startDrawPolygon.bind(this)}
          clearDraw={this.clearDraw}
        />
        <MouseTool init={this.initMouseTools} drawEnd={this.drawEnd} />
        {selectList.length > 0 && (
          <DeviceList
            className="device-list-layout"
            listData={selectList}
            hasTitle={true}
            hasClear={true}
            checkable={false}
            title={`${title || '已选摄像机'}(${selectList.length}个)`}
            onChange={this.listChange}
          />
        )}
        <MapResetTools />
      </React.Fragment>
    );
  }
}
export default SelectMap;
