import React from 'react';
import PropTypes from 'prop-types';

import './index.less';

const EchartsReact = Loader.loadModuleComponent('EchartsReact','default');
const splitNum = (data = 0) => {
  return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
class AlarmTypeEchart extends React.Component {
  static propTypes = {
    circleList: PropTypes.object
  };
  getOtionTem() {
    let { typeList = {}} = this.props;
    let keyPointCount = typeList.keyPointCount || 0;
    let outsiderCount = typeList.outsiderCount || 0;
    let privateNetCount = typeList.privateNetCount || 0;
    let blackpercent =
      (keyPointCount / (keyPointCount + outsiderCount + privateNetCount)) * 100;
    let whitepercent =
      (outsiderCount / (keyPointCount + outsiderCount + privateNetCount)) * 100;
    let machinepercnet =
      (privateNetCount / (keyPointCount + outsiderCount + privateNetCount)) * 100;
    let myColor = [
      {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: '#8899BB' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#8899BB' // 100% 处的颜色
          }
        ],
        globalCoord: false // 缺省为 false
      },
      {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: '#A3B8DC ' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#A3B8DC  ' // 100% 处的颜色
          }
        ],
        globalCoord: false // 缺省为 false
      },
      {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: ' #FFAA00 ' // 0% 处的颜色
          },
          {
            offset: 1,
            color: ' #FFAA00 ' // 100% 处的颜色
          }
        ],
        globalCoord: false // 缺省为 false
      }
    ];

    var data = [
      {
        value: keyPointCount,
        name: '重点人员告警'
      },
      {
        value: outsiderCount,
        name: '外来人员告警'
      },
      {
        value: privateNetCount,
        name: '专网套件告警'
      }
    ];
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          if (params.dataIndex == 0) {
            return `${params.name} : ${params.value}<br/>(${
              blackpercent ? blackpercent.toFixed(2) : 0
            }%)`;
          } else if (params.dataIndex == 1) {
            return `${params.name} : ${params.value}<br/>(${
              whitepercent ? whitepercent.toFixed(2) : 0
            }%)`;
          } else {
            return `${params.name} : ${params.value}<br/>(${
              machinepercnet ? machinepercnet.toFixed(2) : 0
            }%)`;
          }
        },
        confine: true
      },
      legend: {
        orient: 'horizontal',
        itemHeight: 4,
        itemGap: 4,
        bottom: 10,
        data: [
          {
            name: '重点人员',
            textStyle: { color: ' #333333' }
          },
          {
            name: '外来人员',
            textStyle: { color: '#333333' }
          },
          {
            name: '一体化布控报警',
            textStyle: { color: '#333333' }
          }
        ]
      },
      color: myColor,
      series: [
        {
          type: 'pie',
          radius: ['29%', '75%'],
          label: {
            normal: {
              show: false
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: data
        },
        {
          type: 'pie',
          radius: ['75%', '85%'],
          label: {
            normal: {
              show: false,
              textStyle: {
                fontSize: 24,
                color: '#ade3ff'
              }
            }
          },
          animation: false,
          labelLine: {
            normal: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              opacity: 0.3
            }
          },
          data: data
        }
      ]
    };

    return option;
  }
  render() {
    const { typeList = {} } = this.props;
    const {
      keyPointCount, outsiderCount, privateNetCount
     } = typeList; 
     const blackpercent =
       (keyPointCount /
         (keyPointCount + outsiderCount + privateNetCount)) *
       100;
     const whitepercent =
       (outsiderCount /
         (keyPointCount + outsiderCount + privateNetCount)) *
       100;
     const machinepercnet =
       (privateNetCount /
         (keyPointCount + outsiderCount + privateNetCount)) *
       100;
    return (
      <div className="alarm-type-echart">
        <EchartsReact
          option={this.getOtionTem()}
          style={{ height: 'calc(100% - 32px)', width: '100%' }}
        />
          <div className="alarm-line-real">
        <div className="alarm-line-word-real">
          <div />
          <div className="alarm-get-pic">
            <span>
              &nbsp;&nbsp;重点人员告警：
              <span className="second-span">
                {blackpercent ? blackpercent.toFixed(2) : 0}%
              </span>
              <span style={{ width: '30px' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {keyPointCount
                  ? parseFloat(keyPointCount).toLocaleString()
                  : 0}
              </span>
            </span>
          </div>
        </div>
        <div className="alarm-line-word-real one">
          <div />
          <div className="alarm-get-pic">
            <span>
              &nbsp;&nbsp;外来人员告警：
              <span className="second-span">
                {whitepercent ? whitepercent.toFixed(2) : 0}%
              </span>
              <span style={{ width: '30px' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {outsiderCount
                  ? parseFloat(outsiderCount).toLocaleString()
                  : 0}
              </span>
            </span>
          </div>
        </div>
        <div className="alarm-line-word-real two">
          <div />
          <div className="alarm-get-pic">
            <span>
              &nbsp;&nbsp;专网套件告警：
              <span className="second-span">
                {machinepercnet ? machinepercnet.toFixed(2) : 0}%
              </span>
              <span style={{ width: '30px' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {privateNetCount
                  ? parseFloat(privateNetCount).toLocaleString()
                  : 0}
              </span>
            </span>
          </div>
        </div>
      </div>
      </div>
    );
  }
}
export default AlarmTypeEchart;
