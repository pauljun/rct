import React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import DeviceInfo from './components/DeviceInfo';
import BaseInfo from './components/BaseInfo';
import FunInfo from './components/FunInfo';
import MotionFindInfo from './components/MotionFindInfo';
import OSDInfo from './components/OSDInfo';
import { Form, Button, message } from 'antd';
import { toJS } from 'mobx';
import {cloneDeep}from 'lodash'
// import { errorBoundary } from '../../../../utils/Decorator';

import '../deviceView/style/edit.less';

// @errorBoundary

const searchFormat = Utils.queryFormat
const NoData = Loader.loadBaseComponent('NoData');
const Loading = Loader.Loading;
const Container = Loader.loadBusinessComponent('SystemWrapper');

@withRouter
@Decorator.businessProvider('deviceManagement','device','tab')
@observer
@Form.create({
  onFieldsChange: (props, files) => {
    const { deviceManagement } = props;
    let data = {};
    Object.keys(files).map(key => {
      data[key] = files[key].value;
    });
    deviceManagement.mergeFormData(data);
  }
})
class DeviceEdit extends React.Component {
  constructor(props) {
    super(props);
    let isView = false;
    try {
      isView = !!props.location.state.pageState.isView;
    } catch (e) {}
    this.state = {
      isView,
      info: {},
      otherInfo: {},
      initData: false,
      noData: false
    };
  }
  componentWillMount() {
    const { location,deviceManagement} = this.props;
    let params = searchFormat(location.search);
    let cameraInfo = toJS(BaseStore.device.queryCameraById(params.id));
    if (!cameraInfo) {
      this.setState({ noData: true, initData: true });
      return;
    }
    Service.device.queryDeviceInfo(params.id)
    .then(res => {
      const id = cameraInfo.cid || cameraInfo.id;
      const name = cameraInfo.deviceName || cameraInfo.name;
      const deviceType = cameraInfo.deviceType;
      let ptzType;
      try {
        ptzType = cameraInfo.extJson.cameraInfo.type;
      } catch (e) {
        ptzType = null;
      }
         this.setState({
          info: cameraInfo,
          otherInfo: res.data,
          initData: true,
          noData: false
        });
        deviceManagement.mergeFormData({id:cameraInfo.id});
      // device.asyncGetCurrentVideoList(
      //   [id],
      //   [name],
      //   [deviceType],
      //   [ptzType]
      // ).then(fileData => {
      //   cameraInfo.file = fileData[0].file;
      //   this.setState({
      //     info: cameraInfo,
      //     otherInfo: res.result,
      //     initData: true,
      //     noData: false
      //   });
      // });
    })
    .catch((error) => {
      this.setState({ noData: true, initData: true });
    });
  }
  updateCameraInfo() {
    const {deviceManagement} = this.props
    let options = {
      id: deviceManagement.formData.id,
      cameraOrientation: deviceManagement.formData.cameraOrientation,
      deviceName: deviceManagement.formData.deviceName,
      image_invert: deviceManagement.formData.image_invert,
      inOutDirection:+deviceManagement.formData.inOutDirection,
      industry1:deviceManagement.formData.industry1,
      industry2:deviceManagement.formData.industry2,
      installationMethod:deviceManagement.formData.installationMethod,
      pathId:deviceManagement.formData.pathId,
      isIdleDeal:+deviceManagement.formData.isIdleDeal,
      maintenancePhone:deviceManagement.formData.maintenancePhone,
      osd: deviceManagement.formData.osd,
      resolution: deviceManagement.formData.resolution,
      video_quality:deviceManagement.formData.video_quality,
      alarmBean:{
        count: deviceManagement.formData.count,
        interval: deviceManagement.formData.interval,
        push: deviceManagement.formData.push,
        sensitivity:deviceManagement.formData.sensitivity,
        zone: deviceManagement.formData.zone
      }
    };
    for (let k1 in options) {
      if (options[k1] === undefined || options[k1] === 'undefined') {
        delete options[k1];
      }
      for (let k2 in options.alarmBean) {
        if (
          options.alarmBean[k2] === undefined ||
          options.alarmBean[k2] === 'undefined'
        ) {
          delete options.alarmBean[k2];
        }
      }
    }
    console.log(options,222)
    // options.otherInfo=null
    return Service.device.updateDevice(options);
  }


  subEditForm = () => {
    const { form, deviceManagement } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      this.updateCameraInfo().then(res => {
        SocketEmitter.emit('deviceEdit');
        message.success('操作成功！');
      });
    });
  };
  cancelEdit = () => {
     const { location, tab } = this.props;
    tab.closeCurrentTab({ location })
  };
  render() {
    const { form } = this.props;
    const { info, otherInfo, initData, isView, noData } = this.state;
    const deviceInfo = Object.assign(info, otherInfo);
    if (!initData || !deviceInfo.id) {
      return <Loading />;
    }
    if (noData) {
      return <NoData />;
    }
    return (
      <Container 
        name={'设备编辑'}
        width='100%'
      >
        <div
          className={`device-edit-layout ${isView ? 'device-detail-layout' : ''}`}
        >
          <div className="device-contianer">
            <div className="device-edit-scroller">
              <div className="device-edit-content">
                <DeviceInfo info={deviceInfo} />
                <BaseInfo form={form} info={deviceInfo} isView={isView} />
                {info.deviceType * 1 !== 100602 && (
                  <React.Fragment>
                    <FunInfo form={form} info={deviceInfo} isView={isView} />
                    <MotionFindInfo
                      form={form}
                      info={deviceInfo}
                      isView={isView}
                    />
                  </React.Fragment>
                )}
                <OSDInfo form={form} info={deviceInfo} isView={isView} />
              </div>
              {!isView && (
                <div className="setting-edit-btns">
                  <Button onClick={this.cancelEdit}>取消</Button>
                  <Button type="primary" onClick={this.subEditForm}>
                    保存
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default DeviceEdit;