import React from 'react';

const IconFont=Loader.loadBaseComponent('IconFont')
export default class CameraShow extends React.Component {                                                                                                      
  constructor(props) {
    super(props);
    this.state = {
      cameraList: []                                                                    
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      cameraList: nextProps.CameraList                            
    });
  }
  componentDidMount() {
    const { CameraList } = this.props;
    this.setState({
      cameraList: CameraList
    });
  }
  render() {
    const { cameraList } = this.state;
    const b =Array.isArray(cameraList)&& cameraList
      .filter(v => v.deviceType == 100604)
      .map(v => v.count)
    const c = b[0]; //智能枪机
    const e = Array.isArray(cameraList)&&cameraList
      .filter(v => v.deviceType == 100603)
      .map(v => v.count)
    const f = e[0]; //抓拍机
    const h = Array.isArray(cameraList)&&cameraList
      .filter(v => v.deviceType == 103501|| v.deviceType == 103502)
      .map(v => v.count)
    const i = h[0]; //门禁
    const k =Array.isArray(cameraList)&& cameraList
      .filter(v => v.deviceType == 103407)
      .map(v => v.count)
    const l = k[0]; //闸机
    const n =Array.isArray(cameraList)&& cameraList
      .filter(v => v.deviceType == 100602)
      .map(v => v.count)
    const o = n[0]; //球机
    return (
      <React.Fragment>
        <div className="content_people">
          <div className="content_people_left">
            <IconFont type={'icon-_Camera__Main1'} theme="outlined" />
            <span className="left_title">智能枪机</span>
          </div>
          <div className="content_people_right">{c ? c : 0}</div>
        </div>
        <div className="content_people">
          <div className="content_people_left">
            <IconFont type={'icon-_Camera__Main'} theme="outlined" />
            <span className="left_title">球机</span>
          </div>
          <div className="content_people_right">{o ? o : 0}</div>
        </div>
        <div className="content_people">
          <div className="content_people_left">
            <IconFont type={'icon-_Camera__Main3'} theme="outlined" />
            <span className="left_title">抓拍机</span>
          </div>
          <div className="content_people_right">{f ? f : 0}</div>
        </div>
        <div className="content_people">
          <div className="content_people_left">
           <IconFont type={'icon-Entrance_Guard'} theme="outlined" />
            <span className="left_title">门禁</span>
          </div>
          <div className="content_people_right">{i ? i : 0}</div>
        </div>
        <div className="content_people">
          <div className="content_people_left">
          <IconFont type={'icon-Dataicon__Dark'} theme="outlined" />
            <span className="left_title">闸机</span>
          </div>
          <div className="content_people_right">{l ? l : 0}</div>
        </div>
      </React.Fragment>
    );
  }
}
