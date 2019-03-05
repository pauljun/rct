import React from 'react';

const MapC = Loader.loadBusinessComponent('MapComponent', 'CommunityMap');

const villages = [
  {
    address: '丁香路汇景新城二期',
    cityName: '南昌市',
    createTime: '1532685855059',
    deviceCount: '69',
    districtName: '新建县',
    id: '108100000017',
    picUrl: 'https://jxsr-oss1.antelopecloud.cn/files?obj_id=5bf58f3f800040030410f66b&access_token=2147500035_3356491776_1574355648_5a1a77feebb56bd97a510479208d2925',
    placeId: '14',
    provinceName: '江西省',
    rangeCoordinates: '[[113.364205,23.151593],[113.368035,23.150636],[113.366941,23.14813],[113.363626,23.14886],[113.363733,23.1496],[113.363497,23.150271],[113.364183,23.151544]]',
    villageName: '汇景新城二期'
  }
];

@Decorator.businessProvider('device')
class Test extends React.Component {
  communityRef = React.createRef();
  init = () => {
    console.log(this.communityRef.current);
    setTimeout(() => this.communityRef.current.jumpCommunity(villages[0].id), 100);
  };
  render() {
    return <MapC loadSuccess={this.init} points={this.props.device.cameraArray} villages={villages} ref={this.communityRef} onChange={this.onChange} />;
  }
}

export default Test;
