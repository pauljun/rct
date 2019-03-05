import React from 'react';
import { videoContext } from '../moduleContext';
import '../style/mapTools.less';

const IconFont = Loader.loadBaseComponent('IconFont')
const FullScreenLayout = Loader.loadBaseComponent('FullScreenLayout')
const deviceType = Dict.map.cameraType.filter(v => v.value !== '-1');
const deviceStatus = Dict.map.deviceStatus.filter(v => v.value !== '-1');


@videoContext
class MapTools extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: deviceType.map(v => v.value),
      status: deviceStatus.map(v => v.value)
    };
  }
  changeMapMarker(changeType, code, flag) {
    const { clusterMarker } = this.props;
    const state = this.state;
    const index = state[changeType].indexOf(code);
    if (index > -1) {
      state[changeType].splice(index, 1);
    } else {
      state[changeType].push(code);
    }
    this.setState({ [changeType]: state[changeType] }, () => {
      clusterMarker.showCustomMarker(this.state.type, this.state.status);
    });
  }

  render() {
    const {
      startDrawRect,
      startDrawCircle,
      startDrawPolygon,
      clearDraw,
      videoLayoutDom,
      ProcessRef
    } = this.props;
    return (
      <div className="video-map-tools">
        <div className="tools-layout">
          <div className="map-draw-layout">
            <div
              className="tools-draw"
              onClick={() => startDrawRect && startDrawRect()}
            >
              <IconFont className="icon-primary" type="icon-Choose__Main1" theme="outlined" />
              框选
            </div>
            <div
              className="tools-draw"
              onClick={() => startDrawCircle && startDrawCircle()}
            >
              <IconFont className="icon-primary" type="icon-Choose__Main" theme="outlined" />
              圆选
            </div>

            <div
              className="tools-draw"
              onClick={() => startDrawPolygon && startDrawPolygon()}
            >
              <IconFont className="icon-primary" type="icon-Choose__Main2" theme="outlined" />
              多边形
            </div>
            <div
              className="tools-draw"
              onClick={() => clearDraw && clearDraw()}
            >
              <IconFont className="icon-primary" type="icon-Close_Main1" theme="outlined" />
              清除
            </div>
          </div>
          <FullScreenLayout
            className="tools-screen"
            ProcessRef={ProcessRef}
            getContainer={() => videoLayoutDom}
          />
        </div>
      </div>
    );
  }
}
export default MapTools