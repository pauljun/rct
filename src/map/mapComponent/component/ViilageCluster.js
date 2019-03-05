import React from 'react';
import { IbsAMapCustomStyles } from '../../config';
import { createMarker } from '../factory/MapFactory';
import { map } from '../mapContext';
import ResourceLayer from './ResourceLayer';

const deviceType = Dict.getDict('deviceType').filter(v => v.value !== '-1');
const deviceStatus = Dict.getDict('deviceStatus').filter(v => v.value !== '-1');

const Color = {
  Assigned: '#ffaa00',
  Unallocated: '#939cae'
};

@map
class ViilageCluster extends React.Component {
  constructor(props) {
    super(props);
    this.markers = [];
    this.clusterLayer = null;
    this.types = deviceType.map(v => v.value);
    this.status = deviceStatus.map(v => v.value);
  }
  componentDidMount() {
    this.createClusterLayer(this.props);
  }
  componentDidUpdate() {
    console.time('创建点位数据')
    const { points = [], options = {},selectPoints = [] } = this.props;
    this.clearMarkers();
    this.createMakers(
      points,
      options,
      selectPoints
    );
    this.showCustomMarker(this.types, this.status);
    console.timeEnd('创建点位数据')
  }
  componentWillUnmount() {
    this.clearMarkers();
    this.props.mapMethods.removeOverlayers(this.clusterLayer);
    this.markers = null;
    this.clusterLayer = null;
    this.types = null;
    this.status = null;
  }
  createClusterLayer(props) {
    const { points = [], options = {},selectPoints = [] } = props;
    const { map } = this.props;

    //TODO 创建点位数据
    this.createMakers(points, options,selectPoints);
    //TODO 创建图层
    AMap.plugin('AMap.MarkerClusterer', () => {
      this.clusterLayer = new AMap.MarkerClusterer(map, this.markers, {
        styles: IbsAMapCustomStyles,
        minClusterSize: 2,
        gridSize: 20,
        maxZoom: 17,
        averageCenter: false
      });
      if (options.clusterclick) {
        this.clusterLayer.on('click', function(e) {
          options.clusterclick(e);
        });
      }
    });
  }

  createMakers(points = [], options = {}, selectPoints = []) {
    const selectIds = selectPoints.map(v => v.id);
    return points
      .filter(item => {
        return !!item.longitude && !!item.latitude;
      })
      .map(item => {
        let isInSelect = selectIds.indexOf(item.id) > -1;
        let marker = createMarker(
          item,
          options,
          null,
          null,
          isInSelect ? Color.Assigned : Color.Unallocated
        );
        this.markers.push(marker);
        return marker;
      });
  }

  clearMarkers() {
    this.clusterLayer.clearMarkers();
    this.markers = [];
  }

  showCustomMarker(types, status) {
    this.clusterLayer.clearMarkers();
    let markers = this.markers.filter(item => {
      const info = item.getExtData();
      const hasType = types.findIndex(v => v == info.type) > -1;
      const hasStatus = status.findIndex(v => v == info.status) > -1;
      return hasType && hasStatus;
    });
    this.clusterLayer.addMarkers(markers);
    this.status = status;
    this.types = types;
  }

  render() {
    if (!this.props.filterResource) {
      return null;
    } else {
      return (
        <ResourceLayer
          excludeTypes={this.props.excludeTypes}
          hideFeatures={this.props.hideFeatures}
          showCustomMarker={(...args) => this.showCustomMarker(...args)}
        >
          {this.props.children}
        </ResourceLayer>
      );
    }
  }
}

export default ViilageCluster