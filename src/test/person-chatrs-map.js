import React from 'react';
import './index.scss';

const data = [
  {
    name: '湖北省',
    position: [114.341745, 30.546557],
    count: 147,
    list: [
      {
        name: '新疆维吾尔自治区',
        position: [87.627704, 43.793026],
        count: 51
      },
      {
        name: '台湾省',
        position: [121.509062, 25.044332],
        count: 50
      },
      {
        name: '香港特别行政区',
        position: [114.171203, 22.277468],
        count: 11
      },
      {
        name: '澳门特别行政区',
        position: [113.543028, 22.186835],
        count: 5
      },
      {
        name: '南昌',
        position: [115.857963, 28.683016],
        count: 30
      }
    ]
  },
  {
    name: '新疆维吾尔自治区',
    position: [87.627704, 43.793026],
    count: 10,
    list: [{ name: '湖北省', position: [114.341745, 30.546557], count: 10 }]
  },
  {
    name: '台湾省',
    position: [121.509062, 25.044332],
    count: 50,
    list: [{ name: '湖北省', position: [114.341745, 30.546557], count: 50 }]
  },
  {
    name: '香港特别行政区',
    position: [114.171203, 22.277468],
    count: 11,
    list: [{ name: '湖北省', position: [114.341745, 30.546557], count: 11 }]
  },
  {
    name: '澳门特别行政区',
    position: [113.543028, 22.186835],
    count: 5,
    list: [{ name: '湖北省', position: [114.341745, 30.546557], count: 5 }]
  },
  {
    name: '南昌',
    position: [115.857963, 28.683016],
    count: 30,
    list: [{ name: '湖北省', position: [114.341745, 30.546557], count: 30 }]
  }
];

const PersonPathGraph = Loader.loadBusinessComponent('MapComponent', 'PersonPathGraph');


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
        <PersonPathGraph init={this.init} hasInfo={true} />
      </div>
    );
  }
}

export default Test;
