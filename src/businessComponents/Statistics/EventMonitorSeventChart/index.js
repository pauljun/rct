import React, { Component } from 'react';
import './index.less';

const EchartsReact = Loader.loadModuleComponent('EchartsReact','default');

class EventMonitorSeventChart extends Component {
  getOtionTem() {
    let chartList = this.props.chartList;
 
    //近一周的日期数组
    let maxNum = Math.max(...chartList);
    let base = maxNum > 1000 ? 1000 : 1;
    let unit = maxNum > 1000 ? '千' : '';
    chartList = chartList.map(v => v / base);
    const weekDays = [
      Utils.getDay(-7),
      Utils.getDay(-6),
      Utils.getDay(-5),
      Utils.getDay(-4),
      Utils.getDay(-3),
      Utils.getDay(-2),
      Utils.getDay(-1)
    ];

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        confine: true
      },
      grid: {
        x: 63,
        y: 10,
        x2: 30,
        y2: 50,
        borderWidth: 0
      },
      legend: {
        orient: 'horizontal',
        icon: 'rect',
        itemGap: 6,
        itemWidth: 20,
        itemHeight: 4,
        bottom: -5,
        data: [
          {
            name: '魅影布防',
            textStyle: { color: ' #333333' }
          }
        ]
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.1],
        name: unit,
        nameLocation: 'end',
        axisTick: false,
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#333333'
          }
        },
        splitLine: {
          lineStyle: {
            color: ['#D8DCE3']
          }
        }
      },
      yAxis: {
        type: 'category',
        data: weekDays,
        axisTick: false,
        axisLine: {
          show: false
        },
        axisLabel: {
          interval: 0,
          show: true,
          textStyle: {
            color: '#333333'
          }
        }
      },
      series: [
        {
          barWidth: 8,
          barGap: 0.8,
          name: '魅影布防',
          type: 'bar',
          label: {
            emphasis: {
              show: true,
              position: 'right',
              textStyle: {
                fontSize: '12',
                color: ' #8899BB'
              }
            }
          },
          data: chartList,
          itemStyle: {
            normal: { color: ' #8899BB' }
          }
        }
      ]
    };

    return option;
  }
  render() {
    return (
      <div className="chartAnother">
        <EchartsReact
          option={this.getOtionTem()}
          style={{ height: 'calc(100% - 22px)' }}
        />
      </div>
    );
  }
}
export default EventMonitorSeventChart;
