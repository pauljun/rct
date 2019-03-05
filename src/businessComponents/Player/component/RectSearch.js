import React, { Component } from 'react';
const PictureTools = Loader.loadBusinessComponent('PictureTools');

class RectSearch extends Component {

  initPictureTools = (pictureCanvas) => {
    this.pictureCanvas = pictureCanvas;
    this.pictureCanvas.startScreenshot();
    const { getPictureCanvasRef } = this.props;
    getPictureCanvasRef && getPictureCanvasRef(this.pictureCanvas)
  }

  componentWillUnmount() {
    this.pictureCanvas = null;
  }

  render() {
    const { className='', rectSearchOptions } = this.props;
    return (
      <div className={className}
        draggable={false}
      >
        <PictureTools 
          {...rectSearchOptions} 
          onInit={this.initPictureTools}
          allowDrag={false}
        />
      </div>
    )
  }
}

export default RectSearch;