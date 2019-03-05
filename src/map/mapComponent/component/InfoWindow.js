import React from 'react';
import ReactDOM from 'react-dom';
import {map} from '../mapContext';

@map
class InfoWindow extends React.Component {
  constructor(props) {
    super(props);
    this.infoDOM = document.createElement('div');
    this.infoDOM.className = `custom-info-window-amp`;
    this.infoWindow = null;
    this.timer = null;
  }
  componentDidMount() {
    this.createInfoWindow();
  }

  /***新建infoWindow */
  createInfoWindow() {
    AMapUI.loadUI(['overlay/SimpleInfoWindow'], SimpleInfoWindow => {
      this.infoWindow = new SimpleInfoWindow({
        isCustom: true,
        autoMove: false,
        offset: new AMap.Pixel(-2, -5)
      });
      this.infoWindow.setContent(this.infoDOM);
      this.props.init && this.props.init(this);
    });
  }
  /**
   * 关闭infoWindow
   */
  close() {
    try {
      if (this.infoWindow.getIsOpen()) {
        this.infoWindow.close();
      }
    } catch (e) {}
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
    if (this.infoWindow) {
      this.infoWindow = null;
      this.props.map.clearInfoWindow();
      setTimeout(() => {
        try {
          this.infoDOM.remove();
          this.infoDOM = null;
        } catch (e) {
          this.infoDOM = null;
        }
      }, 10);
    }
  }

  componentDidUpdate(){
    const nextProps = this.props;
    if (nextProps.visible && this.infoWindow && nextProps.center) {
      let { center } = nextProps;
      const { map, mapMethods } = this.props;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (!nextProps.notMove) {
          let pixel = mapMethods.lnglatToPixel(center, 18);
          pixel.y = pixel.y - 240;
          const position = mapMethods.pixelToLngLat(pixel, 18);
          mapMethods.setZoomAndCenter(18, position);
        }
        this.infoWindow.open(map, center);
      }, 100);
    } else {
      this.close();
    }
  }
  render() {
    return ReactDOM.createPortal(this.props.content, this.infoDOM);
  }
}
export default InfoWindow