import React from 'react';

const MapSelect = Loader.loadBusinessComponent('MapComponent','ZoomCenter');

@Decorator.businessProvider('device')
class Test extends React.Component {
  state = {
    selectList: []
  };
  onChange = (info) => {
    console.log(info)
  };
  render() {
    return <MapSelect points={this.props.device.cameraArray} isModify={true} onChange={this.onChange} />;
  }
}

export default Test;
