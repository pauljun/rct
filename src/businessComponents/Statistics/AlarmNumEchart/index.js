import React, { Component } from 'react';
import './index.less';

const EchartsReact = Loader.loadModuleComponent('EchartsReact','default');

class AlarmNumEchart extends Component {
  constructor() {
    super();
  }
  state={
    circleList:{},
    option:{},
    total:0
  }
  componentWillMount(){
    Service.statistics.countAlarmResultsByHandleType({ alarmTypes: ['1', '2', '5'] }).then(res => {
      if (Object.keys(res).length == 0) {
        return;
      }
      this.setState({
        circleList: res.data
      });
      this.getOtionTem()
    });
  }
  getOtionTem() {
    const { effectiveCount, ineffectiveCount, unHandledCount } = this.state.circleList;
    let total = Utils.splitNum(effectiveCount*1 + ineffectiveCount*1 + unHandledCount*1)
    let otherCount = effectiveCount*1 + ineffectiveCount*1;
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        confine: true
      },
      grid: {
        x: 30,
        y: 0,
        x2: 50,
        y2: 50,
        borderWidth: 0
      },
      series: [
        {
          name: '告警总量统计',
          type: 'pie',
          radius: ['71%', '70%'],
          hoverAnimation: false,
          label: {
            normal: {
              position: 'center',
              show: false,
              formatter: function(params, ticket, callback) {
                if (params.name === '告警总量') {
                  return (
                    '{blueP|告警总量}\n{blueH2|' + params.value + '}\n{hr|}\n'
                  );
                } else {
                  return (
                    '\n{block|待处理告警总量}\n{blueP|待处理告警总量}\n{blueH3|' +
                    params.value +
                    '}\n'
                  );
                }
              },
              rich: {
                hr: {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  width: 120,
                  // borderWidth: 1,
                  height: 1,
                  shadowColor: 'rgba(255,255,255,0.7)',
                  shadowBlur: 2
                },
                orangeP: {
                  color: '#FFAF5D',
                  fontSize: 12,
                  align: 'center',
                  padding: [5, 0]
                },
                orangeH2: {
                  color: '#FFAF5D',
                  fontSize: 16,
                  align: 'center',
                  fontWeight: 'bold',
                  padding: [5, 0]
                },
                block: {
                  color: 'rgba(0,0,0,0)',
                  fontSize: 8,
                  align: 'center'
                },
                blueP: {
                  color: '#666666 ',
                  fontSize: 12,
                  align: 'center',
                  fontWeight: 300,
                  padding: [5, 0]
                },
                blueH2: {
                  color: ' #151515 ',
                  fontSize: 24,
                  align: 'center',
                  fontWeight: 'bold',
                  padding: [5, 0]
                },
                blueH3: {
                  color: ' #FFAA00 ',
                  fontSize: 24,
                  align: 'center',
                  fontWeight: 'bold',
                  padding: [5, 0]
                }
              }
            }
          },
          data: [
            {
              value: unHandledCount,
              name: '待处理告警总量',
              itemStyle: {
                normal: {
                  shadowColor: '#EAEDF1',
                  shadowBlur: 10,
                  borderWidth: 14,
                  borderColor: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#FF8800' // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#FFAA00' // 100% 处的颜色
                      }
                    ],
                    globalCoord: false // 缺省为 false
                  }
                }
              }
            },
            {
              value: otherCount,
              name: '已处理告警量',
              itemStyle: {
                normal: {
                  shadowColor: '#EAEDF1',
                  shadowBlur: 10,
                  borderWidth: 9,
                  borderColor: '#D8DCE3 '
                }
              }
            }
          ]
        }
      ]
    };
    this.setState({
      option,
      total
    })
  }
  render() {
    const { unHandledCount } = this.state.circleList;   
    const { option,total } = this.state;
    return(
      <div className="alarm-num-echart">
        <EchartsReact
          option={option}
          style={{ height: 'calc(100% - 32px)', width: '100%' }}
        />
        <div className="circle-word">
          <div className="circle-word-count">
            <div>告警总量</div>
            <div className="font-resource-normal">
              {total}
            </div>
          </div>
          <div className="circle-nohandle-count">
            <div>待处理告警总量</div>
            <div className="font-resource-normal">
              {Utils.splitNum(unHandledCount)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default AlarmNumEchart;
