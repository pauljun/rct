import React from 'react';
import './index.scss';

const SetPointMap = Loader.loadBusinessComponent('MapComponent','SetPointMap');

@Decorator.businessProvider('device')
class Test extends React.Component {
  render() {
    // return null
    return (
      <div style={{width:'100%',height:'100%'}}>
        <SetPointMap point={BaseStore.device.cameraArray[0]}/>
      </div>
    );
  }
}

export default Test;
