import React from 'react';
import { inject } from 'mobx-react';
const { MakerPoints, MapComponent, ClusterMarker, MapResetTools } = LMap;
const { mj, zj, wifi } = Dict.map;

@inject('device')
class SimpleMap extends React.PureComponent {
  constructor(props) {
    super(props);
    this.map = null;
    this.placeArea = [];
    this.circleMarker = null;
    this.centerMarker = null;
    this.state = {
      center: [0, 0],
      key: Math.random()
    };
  }
  initMap = map => {
    this.map = map;
  };

  componentWillUnmount() {
    this.placeArea = [];
    this.circleMarker = null;
    this.clusterMarker = null;
  }
  markerClick(data, options = {}) {
    this.props.markerClick && this.props.markerClick(data.cid);
  }
  initMarkerPoint = markerPoint => {
    this.markerPoint = markerPoint;
    this.initOverlayers(this.props);
  };
  componentWillReceiveProps(props) {
    if (props.id !== this.props.id && this.map) {
      this.initOverlayers(props);
    }
  }

  initOverlayers(props) {
    this.removeOverlayers();
    const { center, zoom = 11, polyline, point } = props;

    try {
      this.createOverlayers({ point, polyline });
    } catch (e) {
      console.error('创建地图覆盖物出错', e);
    }
    const newOverlayers = [this.circleMarker, ...this.placeArea, this.centerMarker].filter(v => !!v);
    if (center && center[0]) {
      this.map.setZoomAndCenter(zoom, center);
    }
    this.map.addOverlayers(newOverlayers);
    if (this.placeArea.length > 0) {
      this.map.setFitView(this.placeArea);
    }
  }

  removeOverlayers() {
    const overlayers = [this.circleMarker, ...this.placeArea, this.centerMarker].filter(v => !!v);
    this.map.removeOverlayers(overlayers);
    this.placeArea = [];
    this.circleMarker = null;
    this.centerMarker = null;
  }

  setValigeFitView = (path) => {
    let lngs = [],
      lats = [];
    lngs = path.map(d => d[0]);
    lats = path.map(d => d[1]);
    let lngMax = Math.max(...lngs);
    let lngMin = Math.min(...lngs);
    let latMax = Math.max(...lats);
    let latMin = Math.min(...lats);
    let bounds = new AMap.Bounds([lngMin, latMin], [lngMax, latMax]);
    return bounds;
  }
  createOverlayers = ({ point, polyline }) => {
    let { centerRadius } = this.props;
    if (point && point.latitude && point.longitude && this.markerPoint) {
      this.centerMarker = this.markerPoint.createMarker(point, { w: 30, h: 40, offset: [-15, -40] }, { isMut: true }, true);
      if (centerRadius) {
        this.circleMarker = new AMap.Circle({
          center: new AMap.LngLat(point.longitude, point.latitude), // 圆心位置
          zIndex: 99,
          strokeWeight: 2,
          fillOpacity: 0.05,
          fillColor: '#44AAFF',
          strokeColor: '#2299FF',
          strokeStyle: 'dashed',
          radius: centerRadius || 500 // 圆半径
        });
      }
    }
    if (polyline) {
      let allPoly=[]
      polyline.split('|').map(polylineItem => {
        let path = polylineItem.split(';').map(v => v.split(','));
        allPoly = allPoly.concat(path)
        this.placeArea.push(
          new AMap.Polygon({
            zIndex: 100,
            strokeWeight: 2,
            path: path,
            fillOpacity: 0.1,
            fillColor: '#44AAFF',
            strokeColor: '#2299FF',
            strokeStyle: 'dashed'
          })
        ) 
      })
      if (allPoly.length){
        this.map.setBounds(this.setValigeFitView(allPoly))
      }
    }
  };
  reset = () => {
    const { center, points, zoom = 17 } = this.props;
    if (center && center[0]) {
      this.map && this.map.setZoomAndCenter(zoom, center);
    } else {
      this.map && points[0] && points[0].longitude && this.map.setZoomAndCenter(zoom, [points[0].longitude, points[0].latitude]);
    }
  };
  render() {
    const { device, children, points } = this.props;
    return (
      <MapComponent initMap={this.initMap}>
        <MakerPoints init={this.initMarkerPoint} />
        <ClusterMarker
          options={{
            click: this.markerClick.bind(this)
          }}
          filterResource={false}
          excludeTypes={[mj.value, zj.value, wifi.value]}
          points={points ? points : device.deviceArray}
          init={this.initClusterMarker}
        />
        <MapResetTools click={this.reset} hideReset={true} />
        {children && React.Children.map(children, child => (React.isValidElement(child) ? React.cloneElement(child, { clusterMarker: this.clusterMarker }) : child))}
      </MapComponent>
    );
  }
}

export default SimpleMap;
