import React, { Component } from 'react';
import { observer } from 'mobx-react';

const Circle = Loader.loadBusinessComponent('Statistics','CircleType')

@Decorator.businessProvider("user")
@Decorator.errorBoundary
@observer
class DeviceStatus extends Component {
  state = {
    cameraList: []
  };

  componentDidMount() {
    let organizationId = this.props.user.userInfo.organizationId
    Service.device.countOrganizationDeviceStatus({
      deviceTypes: [],
      organizationIds:[organizationId]
    }).then(res => {
      this.setState({ cameraList: res.data.filter(v => v.organizationId === organizationId) || [] });
    });
  }
  getValue = (data, attr) => {
    let count = 0;
    data.map(v => {
      count += v[attr];
    });
    return count;
  };
  render() {
    let { cameraList } = this.state;
    let { decoration } = this.props;
    let online = this.getValue(cameraList, 'onlineCount');
    let total = this.getValue(cameraList, 'totalCount');
    let offline = 0
    let onlinePercent = 0
    let offlinePercent = 0
    if(total && total > 0){
      offline = total - online
      onlinePercent = ((online / total) * 100).toFixed(2);
      offlinePercent = (((total - online) / total) * 100).toFixed(2);
    }else {
      offline = 0
      onlinePercent = 0.00
      offlinePercent = 0.00
    }
    return (
      <div className="alarm-antd-pr " id="circles">
        <div className="popovers">
          <div>接入设备统计</div>
          <div>
            在线：{Utils.splitNum(online)}&nbsp;(
            {isNaN(onlinePercent) ? 0 : onlinePercent}%)
          </div>
          <div>
            离线：{Utils.splitNum(offline)}&nbsp;(
            {isNaN(offlinePercent) ? 0 : offlinePercent}%)
          </div>
        </div>
        <span
          style={{
            height: '200px',
            width: '200px',
            display: 'block',
            margin: '0 auto'
          }}
        >
          <Circle
            hasText={true}
            lineWidth={15}
            width={200}
            height={200}
            value={online}
            total={total}
            percent={onlinePercent} //比例
            startColor={'#FF8800'}
            endColor={'#FFAA00'}
            textTop={'接入设备数量'}
            textBottom={'在线设备数量'}
          />
        </span>
        <style jsx="true">{`
          #circles {
            position: relative;
          }
          .popovers {
            color: #fff;
            text-align: left;
            width: 170px;
            padding: 10px;
            border-radius: 6px;
            background: rgba(0, 0, 0, 0.6);
            position: absolute;
            top: 50%;
            transform: translateY(-60%);
            left: ${decoration === 'left' ? '80%' : '-20%'};
            display: none;
          }
          #circles:hover .popovers {
            display: block;
          }
        `}</style>
      </div>
    );
  }
}
export default DeviceStatus;
