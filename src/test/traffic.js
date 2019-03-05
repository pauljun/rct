import React from 'react';
import './index.scss';

const data = [
  {
    title: '湖北省',
    cameraName: '湖北省',
    position: [114.341745, 30.546557],
    count: 147,
    cameraId: '342432432',
    date: Date.now().valueOf(),
    dataId: '342432432',
    url:
      'https://jxsr-oss1.antelopecloud.cn/files?access_token=2147500044_0_1579578175_a847468cf2f2688c8c67874d202a8cf8&key=%2f1547805566000002'
  },
  {
    title: '新疆维吾尔自治区',
    cameraName: '新疆维吾尔自治区',
    position: [87.627704, 43.793026],
    date: Date.now().valueOf(),
    count: 10,
    cameraId: '3424765732432',
    dataId: 'fdsgr543ew43wrfe',
    url:
      'https://jxsr-oss1.antelopecloud.cn/files?access_token=2147500044_0_1579578175_a847468cf2f2688c8c67874d202a8cf8&key=%2f1547805566000002'
  },
  {
    title: '台湾省',
    cameraName: '台湾省',
    position: [121.509062, 25.044332],
    date: Date.now().valueOf(),
    count: 50,
    cameraId: '365436',
    dataId: 'fdsgre654w43wrfe',
    url:
      'https://jxsr-oss1.antelopecloud.cn/files?access_token=2147500044_0_1579578175_a847468cf2f2688c8c67874d202a8cf8&key=%2f1547805566000002'
  },
  {
    title: '香港特别行政区',
    cameraName: '香港特别行政区',
    position: [114.171203, 22.277468],
    date: Date.now().valueOf(),
    count: 11,
    cameraId: '34246456532432',
    dataId: 'fdsgrew765443wrfe',
    url:
      'https://jxsr-oss1.antelopecloud.cn/files?access_token=2147500044_0_1579578175_a847468cf2f2688c8c67874d202a8cf8&key=%2f1547805566000002'
  },
  {
    title: '澳门特别行政区',
    cameraName: '澳门特别行政区',
    position: [113.543028, 22.186835],
    count: 5,
    date: Date.now().valueOf(),
    cameraId: '342434325342432',
    dataId: 'fdsgrew43463wrfe',
    url:
      'https://jxsr-oss1.antelopecloud.cn/files?access_token=2147500044_0_1579578175_a847468cf2f2688c8c67874d202a8cf8&key=%2f1547805566000002'
  },
  {
    title: '南昌',
    cameraName: '南昌',
    position: [115.857963, 28.683016],
    date: Date.now().valueOf(),
    count: 30,
    cameraId: '65435432',
    dataId: 'fdsgrew765443wrfe',
    url:
      'https://jxsr-oss1.antelopecloud.cn/files?access_token=2147500044_0_1579578175_a847468cf2f2688c8c67874d202a8cf8&key=%2f1547805566000002'
  }
];

const TrajectoryMap = Loader.loadBusinessComponent(
  'MapComponent',
  'TrajectoryMap'
);

class Test extends React.Component {
  init = trajectory => {
    this.trajectory = trajectory;
    this.trajectory.setData(data);
    console.log(this.trajectory);
  };
  render() {
    // return null
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <TrajectoryMap init={this.init} data={data} />
      </div>
    );
  }
}

export default Test;
