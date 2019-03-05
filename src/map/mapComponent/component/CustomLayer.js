import React from 'react';
import { map } from '../mapContext';

@map
class CustomLayer extends React.Component {
  constructor() {
    super();
    this.customLayer = null;
    this.canvas = null;
    this.ctx = null;
  }
  componentDidMount() {
    this.init();
  }
  init() {
    const {
      alwaysRender,
      zIndex = 120,
      mapMethods,
      renderCanvas,
      map
    } = this.props;
    AMap.plugin('AMap.CustomLayer', () => {
      let canvas = document.createElement('canvas');
      this.customLayer = new AMap.CustomLayer(canvas, {
        zooms: [3, 18],
        alwaysRender: alwaysRender || true,
        zIndex
      });
      this.customLayer.render = () => {
        let { width, height } = mapMethods.getSize();
        if (AMap.Browser.retina) {
          width *= 2;
          height *= 2;
        }
        canvas.width = width;
        canvas.height = height;
        renderCanvas(canvas, canvas.getContext('2d'));
      };
      this.customLayer.setMap(map);
      this.props.init && this.props.init(this);
    });
  }
  forceRender() {
    this.customLayer.render();
  }
  render() {
    return null;
  }
}

export default CustomLayer;
