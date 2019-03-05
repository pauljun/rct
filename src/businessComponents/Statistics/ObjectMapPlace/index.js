import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './index.less';

const EchartsReact = Loader.loadModuleComponent('EchartsReact', 'default');

@Decorator.errorBoundary
@observer
class ObjectMapPalce extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option: {}
    }
  }
  
  componentDidMount() {
    this.getOtionTem(this.props.data);
  }
  getOtionTem(item) {
    let palceList = [], numberList = [];
    Dict.getDict('bigDatePlaceType').map(v => {
      item.find(v1 => {
        if(v1.tag === v.value) {
          palceList.push(v.label);
        }
      })
    });
    item.map(v => numberList.push(v.count));
    let maxNum = Math.max(...numberList);
    let base = maxNum > 10000 ? 10000 : maxNum > 1000 ? 1000 : 1;
    let qu = maxNum > 10000 ? '万' : maxNum > 1000 ? '千' : '';
    let numberLists = numberList.map(v => v / base);
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        confine: true
      },
      grid: {
        show: true,
        x: 60,
        y: 4,
        x2: 10,
        y2: 20,
        borderWidth: 0,
        backgroundColor: '#F3F6F9'
      },
      legend: {
        orient: 'horizontal',
        icon: 'rect',
        itemGap: 6,
        itemWidth: 20,
        itemHeight: 4,
        data: []
      },
      xAxis: {
        type: 'value',
        nameLocation: 'end',
        name: qu,
        minInterval: base < 1000 ? 1 : '',
        boundaryGap: [0, 0.05],
        axisTick: false,
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#666',
            fontFamily: 'ResourceNormal'
          }
        },
        splitLine: {
          show: false
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(250,250,250,0.0)', '#fff']
          }
        }
      },
      yAxis: {
        type: 'category',
        data: palceList,
        axisTick: false,
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#666'
          }
        }
      },
      series: [
        {
          barWidth: 8,
          barGap: 0.5,
          name: '人数',
          type: 'bar',
          label: {
            emphasis: {
              show: true,
              position: 'right',
              textStyle: {
                fontSize: '12',
                color: '#5A60A2',
                fontFamily: 'ResourceNormal'
              }
            }
          },
          data: numberLists,
          itemStyle: {
            normal: { color: '#5A60A2' }
          }
        }
      ]
    };
    this.setState({
      option
    })
  }
  render() {
    return (
      <div className="object-Map-place">
        <EchartsReact
          option={this.state.option}
          style={{ height: 'calc(100%)' }}
        />
      </div>
    );
  }
}
export default ObjectMapPalce;
