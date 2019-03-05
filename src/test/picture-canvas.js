import React from 'react';
import './index.scss';

const PictureCanvas = Loader.loadBusinessComponent('PictureCanvas');

@Decorator.businessProvider('device')
class Test extends React.Component {
  constructor() {
    super();
    this.domRef = React.createRef();
    this.state = {
      start: false
    };
    this.framSelection = null;
  }
  init = framSelection => {
    this.framSelection = framSelection;
  };
  openDraw = () => {
    this.framSelection.startScreenshot();
  };
  closeDraw = () => {
    this.framSelection.closeScreenshot();
  };
  areaScreenshot = () => {
    this.framSelection.getScreenshotSource().then(res => console.log(res));
  };
  componentDidMount() {}
  render() {
    // return null
    return (
      <PictureCanvas
          onInit={this.init}
          renderContent={domRef => (
            <div className="draw-test" ref={domRef}>
              <span>dsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsa</span>
            </div>
          )}
        />
    );
  }
}

export default Test;
