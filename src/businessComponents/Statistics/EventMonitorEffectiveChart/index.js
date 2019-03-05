import React, { Component } from 'react';

import './index.less';

const EchartsReact = Loader.loadModuleComponent('EchartsReact','default');

class EventMonitorEffectiveChart extends Component {
  state = {};
  getOtionTem() {
    let { circleList } = this.props;
    if (!circleList) {
      circleList = {};
    }
    let emphasisNum = +circleList.effectiveCount || 0;
    let outsideNum = +circleList.ineffectiveCount || 0;
    let integrationNum = +circleList.unHandledCount || 0;
    let empercent =
      (emphasisNum / (emphasisNum + outsideNum + integrationNum)) * 100;
    let outpercent =
      (outsideNum / (emphasisNum + outsideNum + integrationNum)) * 100;
    let interpercent =
      (integrationNum / (emphasisNum + outsideNum + integrationNum)) * 100;
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
            color: '#FFAA00' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#FFAA00' // 100% 处的颜色
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
            color: '#25DC9B ' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#25DC9B  ' // 100% 处的颜色
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
            color: ' #A3B8DC ' // 0% 处的颜色
          },
          {
            offset: 1,
            color: ' #A3B8DC ' // 100% 处的颜色
          }
        ],
        globalCoord: false // 缺省为 false
      }
    ];

    var data = [
      {
        value: emphasisNum,
        name: '有效提醒'
      },
      {
        value: outsideNum,
        name: '无效提醒'
      },
      {
        value: integrationNum,
        name: '未处理提醒'
      }
    ];
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          if (params.dataIndex == 0) {
            return `${params.name} : ${params.value}<br/>(${
              empercent ? empercent.toFixed(2) : 0
            }%)`;
          } else if (params.dataIndex == 1) {
            return `${params.name} : ${params.value}<br/>(${
              outpercent ? outpercent.toFixed(2) : 0
            }%)`;
          } else {
            return `${params.name} : ${params.value}<br/>(${
              interpercent ? interpercent.toFixed(2) : 0
            }%)`;
          }
        },
        confine: true
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
    const { circleList } = this.props;
    if (!circleList) {
      return;
    }
    let { effectiveCount, ineffectiveCount, unHandledCount } = circleList;
    effectiveCount = parseInt(effectiveCount);
    ineffectiveCount = parseInt(ineffectiveCount);
    unHandledCount = parseInt(unHandledCount);

    const eff =
      (effectiveCount / (effectiveCount + ineffectiveCount + unHandledCount)) * 100;
    const ineff =
      (ineffectiveCount / (effectiveCount + ineffectiveCount + unHandledCount)) * 100;
    const unhandle =
      (unHandledCount / (effectiveCount + ineffectiveCount + unHandledCount)) * 100;
    return (
      <div className="chartAnother">
        <EchartsReact
          option={this.getOtionTem()}
          style={{ height: 'calc(100% - 32px)' }}
        />
        <div className="alarm-line">
          <div className="alarm-line-word">
            <div />
            <div className="alarm-get-pic">
              <span>
                &nbsp;&nbsp;有效提醒：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="second-span">{eff ? eff.toFixed(2) : 0}%</span>
                <span style={{ width: '30px' }}>
                  {effectiveCount ? parseFloat(effectiveCount).toLocaleString() : 0}
                </span>
              </span>
            </div>
          </div>
          <div className="alarm-line-word one">
            <div />
            <div className="alarm-get-pic">
              <span>
                &nbsp;&nbsp;无效提醒：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="second-span">
                  {ineff ? ineff.toFixed(2) : 0}%
                </span>
                <span style={{ width: '30px' }}>
                  {ineffectiveCount
                    ? parseFloat(ineffectiveCount).toLocaleString()
                    : 0}
                </span>
              </span>
            </div>
          </div>
          <div className="alarm-line-word two">
            <div />
            <div className="alarm-get-pic">
              <span>
                &nbsp;&nbsp;未处理提醒：&nbsp;
                <span className="second-span" style={{ paddingLeft: '1px' }}>
                  {unhandle ? unhandle.toFixed(2) : 0}%
                </span>
                <span style={{ width: '30px', paddingLeft: '1px' }}>
                  {unHandledCount ? parseFloat(unHandledCount).toLocaleString() : 0}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default EventMonitorEffectiveChart;
