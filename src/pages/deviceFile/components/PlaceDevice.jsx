import React from 'react';
const FrameCard = Loader.loadBusinessComponent("FrameCard");
const IconFont = Loader.loadBaseComponent("IconFont");
const ClusterMap = Loader.loadBusinessComponent('MapComponent', 'ClusterMap');
class PlaceDevice extends React.Component {



  render() {
    return <FrameCard title="场所设备：">
        <div className="place-device-view">
          <ClusterMap>
          {/* // points={device.cameraArray}
          // ref={this.mapViewRef}
          // logData={{ isOther: false }} */}
            <div className="place-device-resources">
              <div className="resources-item">
              <div className="left-icon-view" ><IconFont type={'icon-Place_Dark'} /></div>
                <div className="right-content-view">
                  <div className="item-title">小区</div>
                  <div className="item-num primary-color">86</div>
                </div>
              </div>
              <div className="resources-item">
                <div className="left-icon-view" />
                <div className="right-content-view">
                  <div className="item-title">学校</div>
                  <div className="item-num primary-color">86</div>
                </div>
              </div>
              <div className="resources-item">
                <div className="left-icon-view" />
                <div className="right-content-view">
                  <div className="item-title">网吧</div>
                  <div className="item-num primary-color">86</div>
                </div>
              </div>
              <div className="resources-item">
                <div className="left-icon-view"></div>
                <div className="right-content-view">
                  <div className="item-title">娱乐场所</div>
                  <div className="item-num primary-color">86</div>
                </div>
              </div>
              <div className="resources-item">
                <div className="left-icon-view"></div>
                <div className="right-content-view">
                  <div className="item-title">其他</div>
                  <div className="item-num primary-color">86</div>
                </div>
              </div>
            </div>
          </ClusterMap>
        </div>
      </FrameCard>; 
  }
}

export default PlaceDevice