import React from 'react';
import centerImage from '../../../assets/img/MapCenter.svg';
import { inject } from 'mobx-react';
import {cloneDeep} from 'lodash'

const { ClusterMarker, MakerPoints, mapContext, providerMap } = LMap;

@inject('device')
@providerMap('map-zoom-center-layout')
@mapContext.map
class ZoomCenter extends React.Component {
  constructor(props) {
    super(props);
    this.id = Utils.uuid();
    this.markerPoints = null;
  }
  componentWillUnmount() {
    const { mapMethods, isModify = true} = this.props;
    this.markerPoints = null;
    this.points = null;
    this.id = null;
    if (isModify) {
      mapMethods.off('zoomchange', this.mapChange);
      mapMethods.off('moveend', this.mapChange);
    }
  }
  initMakerPoints = markerPoints => {
    const { mapMethods, isModify = true, zoomCenter } = this.props;
    this.markerPoints = markerPoints;
    if (isModify) {
      mapMethods.on('zoomchange', this.mapChange);
      mapMethods.on('moveend', this.mapChange);
    } else {
      this.computedMapInfo();
    }
    zoomCenter ? this.setMapZoomCenter(zoomCenter) : this.mapChange();
  };
  mapChange = () => {
    const { isModify = true } = this.props;
    if (isModify) {
      let info = this.computedMapInfo();
      this.props.mapChange && this.props.mapChange(info);
    }
  };
  computedMapInfo = () => {
    const { mapMethods, isModify = true } = this.props;
    const info = mapMethods.getZoomAndCenter();
    const point = {
      id: this.id,
      longitude: info.center.lng,
      latitude: info.center.lat,
      deviceName: '当前中心点'
    };
    const options = {
      w: 28,
      h: 40,
      offset: [-14, -20],
      draggable: isModify,
      dragend: (point, event, position) => {
        mapMethods.setCenter(position);
      }
    };
    const config = {
      icon: centerImage
    };
    this.markerPoints.createMarker(point, options, config);
    return info
  };
  setMapZoomCenter = info => {
    const { mapMethods } = this.props;
    this.computedMapInfo()
    mapMethods.setZoomAndCenter(info.zoom, info.center);
  };
  render() {
    const { points = [] } = this.props;
    return (
      <React.Fragment>
        <MakerPoints init={this.initMakerPoints} />
        <ClusterMarker points={points} />
      </React.Fragment>
    );
  }
}
export default ZoomCenter;
