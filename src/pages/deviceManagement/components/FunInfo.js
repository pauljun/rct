import React from 'react';
import { Form, Select, Button, Input } from 'antd';
import AlarmZoneView from './AlarmZone';

const Option = Select.Option;
const FormItem = Form.Item;

const video_quality = [
  { value: 1, label: '开启' },
  { value: 0, label: '关闭' }
];
const { videoQuality,resolution,cameraBrand} = Dict.map
const IconFont = Loader.loadBaseComponent('IconFont');
const PlayComponent = Loader.loadBusinessComponent('PlayComponent')

class FunInfo extends React.Component {
  constructor(props) {
    super(props);
    this.setSpaceRef = React.createRef();
    this.defaultZone = [];
    this.state = {
      showSetSpace: false,
      zoneKeys: null,
      zoneArray: [],
      showVideo: true,
      showDele:false,
      key: Math.random(),
      deviceCover: '',
      width: 1136,
      height: 530,
    };
  }
  componentWillUnmount() {
    this.setSpaceRef = null;
    this.defaultZone = null;
  }
  componentDidMount() {
    const { info = {} } = this.props;
    let arr = [];
    this.defaultZone = arr;
    this.getDeviceCover(info.cid).then(deviceCover => {
      let img = document.createElement('img');
      img.src = deviceCover;
      img.onload = () => {
        let { width, height } = this.state;
        const imgWidth = img.width;
        const imgHeight = img.height;
        if((imgWidth / imgHeight) > (width / height)) {
          height = imgHeight * width / imgWidth;
        } else {
          width = imgWidth * height / imgHeight;
        }
        this.setState({
          width, 
          height,
          key: Math.random(),
        })
      }
      this.setState({
        zoneArray: arr,
        brand:info.extJson.cameraInfo && info.extJson.cameraInfo.brand,
        deviceCover
      });
    })
  }
  
  getDeviceCover = (cid) => {
    return Service.video.queryLatestCoverMap(cid)
  }

  getZoneKeys = zoneKeys => {
    this.setState({ zoneKeys });
  };

  /**
   * 显示设置
   */
  openSetSpace = () => {
    this.setState({ showSetSpace: true });
  };

  /**
   * 重置区域，取消修改
   */
  resetZone = () => {
    const { form } = this.props;
    const defaultZone = this.defaultZone &&this.defaultZone.join('');
    form.setFieldsValue({ zone: defaultZone });
    this.setState({ zoneKeys: defaultZone, key: Math.random() });
  };

  /**
   * 确定修改
   */
  setZone = () => {
    const { form } = this.props;
    form.setFieldsValue({ zone: this.state.zoneKeys });
    this.setState({ showSetSpace: false });
  };

  /**
   * 取消修改
   */
  cancleSet = () => {
    const { form } = this.props;
    const defaultZone = this.defaultZone&&this.defaultZone.join('');
    form.setFieldsValue({ zone: defaultZone });
    this.setState({ showSetSpace: false, zoneKeys: null });
  };

  /**
   * 开启选择
   */
  drawSpace = () => {
    this.setSpaceRef.current.selectType(true);
  };

  /**
   * 开启编辑
   */
  changeSpace = () => {
    this.setSpaceRef.current.selectType(false);
  };

  /**
   * 开启清除
   */
  clearSpace = () => {
    this.setSpaceRef.current.clearAll();
  };

  handleFresh = () => {
     let {showVideo}=this.state;
    this.setState({
      showVideo:!showVideo
    })
   /*  console.log(1000);
    this.setState({
      showVideo: false
    });
    setTimeout(() => {
      this.setState({
        showVideo: true
      });
    }, 100); */
  };
  handleVideoPlayState = (status) => {
    if(status=='play'/* ||status=='canplay' */){
   this.setState({
    showDele:true
   })
    } else {
      this.setState({
        showDele:false
      })
    }
  }
  render() {
    const { showSetSpace, zoneArray, key, showVideo, showDele, deviceCover, width, height } = this.state;
    const { form, info, isView } = this.props;
    const { getFieldDecorator } = form;
    let arr = [];
    try {
      arr = info.extJson.cameraInfo.alarm && info.extJson.cameraInfo.alarm.zone && info.extJson.cameraInfo.alarm.zone.split('');
    } catch (e) {
      console.warn('格式化抓拍区域zone数据失败', info.extJson.cameraInfo.alarm.zone);
    }
    this.defaultZone = arr;
    return (
      <div className="edit-info-layout fun-info-layout">
        <h3 className="part-title">功能配置</h3>
        <Form layout="inline" className="base-info-content">
          <FormItem label="画面倒置">
            {getFieldDecorator('image_invert',{
              initialValue: info.extJson && info.extJson.cameraInfo.image_invert && info.extJson.cameraInfo.image_invert
            })(
              <Select placeholder="请设置是否画面倒置" disabled={isView}>
                {video_quality.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="清晰度">
            {getFieldDecorator('video_quality',{
              initialValue: info.extJson&&info.extJson.cameraInfo.video_quality&&info.extJson.cameraInfo.video_quality.toString()
            })(
              <Select placeholder="请设置清晰度" disabled={isView}>
                {videoQuality.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="分辨率">
            {getFieldDecorator('resolution',{
              initialValue: info.extJson && info.extJson.cameraInfo.resolution
            })(
              <Select placeholder="请设置分辨率" disabled={isView}>
                {resolution.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem style={{ display: 'none' }}>
            {getFieldDecorator('zone')(<Input type="hidden" />)}
          </FormItem>
          {!isView && (
            <div className="other-layout-info video-info-part">
              <div className="info-lable">抓拍区域：</div>
              <div className="play-space">
                {/* <div onClick={this.handleFresh} className={`control-video  ${false?'unplay':''}`}>
                  <IconFont className="close-video" type="icon-Close_Main1" />
                </div> */}
                <div className="player-marker-device">
                  <img 
                    src={showVideo ? deviceCover : ''} 
                    crossOrigin='anonymous'
                    style={{ width, height }}
                    alt=""
                  />
                {/* {showVideo ? (
                  <PlayComponent
                      key={645823757436435729}
                      hideBar={true}
                      autoplay={false}
                      fileData={info}
                      isLiving={true}
                    />
                  ) : <PlayComponent
                    key={743795704358385}
                    hideBar={true}
                    autoplay={false}
                    fileData={info}
                    isLiving={true}
                  />
                } */}
                </div>
                <AlarmZoneView
                  key={key}
                  className={`space-set-content ${
                    !showSetSpace ? 'hide-space-set-content' : ''
                  }`}
                  getZoneKeys={this.getZoneKeys}
                  zoneArray={zoneArray}
                  brand={cameraBrand}
                  width={width}
                  height={height}
                  hideBar={true}
                  ref={this.setSpaceRef}
                />
              </div>
              <div className="set-space-btn">
                <div className="left-btn">
                  {showSetSpace && (
                    <React.Fragment>
                      <Button onClick={this.drawSpace} type="primary">
                        选取
                      </Button>
                      <Button onClick={this.changeSpace} type="primary">
                        擦除
                      </Button>
                      <Button onClick={this.clearSpace} type="danger">
                        清空
                      </Button>
                    </React.Fragment>
                  )}
                </div>
                <div className="right-btn">
                  {showSetSpace ? (
                    <React.Fragment>
                      <Button onClick={this.cancleSet}>取消</Button>
                      <Button type="primary" onClick={this.resetZone}>
                        重置
                      </Button>
                      <Button type="primary" onClick={this.setZone}>
                        确定
                      </Button>
                    </React.Fragment>
                  ) : (
                    <Button onClick={this.openSetSpace}>
                      <IconFont type="icon-_Setting" />
                      设置
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </Form>
      </div>
    );
  }
}

export default FunInfo;