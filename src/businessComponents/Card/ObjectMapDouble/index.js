import React from 'react';
import './index.less';

const IconFont = Loader.loadBaseComponent('IconFont');
const ImageView = Loader.loadBusinessComponent('ImageView');

class ObjectMapDouble extends React.Component {
  render() {
    let { captureTime = new Date().valueOf(), leftUrl,rightUrl, deviceName } = this.props;
    return (
      <div className='object-map-double'>
        <div className="double-left">
          <div className='img-case'>
            <ImageView className='img' src={leftUrl} alt=""/>
            <div className="text">被同行人员</div>
          </div>
          <div className="content">
          <IconFont type={'icon-Add_Main'} theme="outlined" />
          <span className='content-message'>{deviceName || '-'}</span>
          </div>   
          <div className="content">
          <IconFont type={'icon-Clock_Main2'} theme="outlined" />
          <span className='content-message'>{Utils.formatTimeStamp(captureTime)}</span>
          </div>  
        </div>
        <div className="double-left">
          <div className='img-case'>
            <ImageView className='img' src={rightUrl} alt=""/>
            <div className="text">同行人员</div>
          </div>
          <div className="content">
          <IconFont type={'icon-Add_Main'} theme="outlined" />
          <span className='content-message'>{deviceName || '-'}</span>
          </div>   
          <div className="content">
          <IconFont type={'icon-Clock_Main2'} theme="outlined" />
          <span className='content-message'>{Utils.formatTimeStamp(captureTime)}</span>
          </div>  
        </div>
      </div>
    );
  }
}

export default ObjectMapDouble;