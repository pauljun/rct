import React, { Component } from 'react';
import { observer } from 'mobx-react';

const EchartsReact = Loader.loadModuleComponent('EchartsReact','default');
const IconFont=Loader.loadBaseComponent('IconFont')

@Decorator.errorBoundary
@observer
class ObjectMapLabel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      option: {},
      data : [],
      total: this.props.total,
      myColor:['#FF8800 ', '#ffaa00', '#b5bbc7']
    }
  }

  componentDidMount() {
    this.getOtionTem();
  }
  getValue = data => {
    let count = 0;
    data &&
      data.map(v => {
        count += v.num;
      });
    return count;
  };
  getOtionTem() {
    let { data, total } = this.props;
    let dataArray = [
      { value: 0, name: '早出晚归' },
      { value: 0, name: '昼伏夜出' },
      { value: 0, name: '其他' },
    ];
    data.map(v => {
      if(v.tag === '119060') {
        dataArray[0].value = v.count
      }
      if(v.tag === '119051') {
        dataArray[1].value = v.count
      }
    });
    dataArray[2].value = total - dataArray[0].value - dataArray[1].value;
    let percentData = (dataArray.length > 0 &&
      dataArray.map(v => (v.value / total) * 100)) || [0, 0, 0];
    const option = {
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: function(params) {
          if (params.dataIndex == 0) {
            return `${params.name} : <br/>${params.value} (${
              percentData[0] ? percentData[0].toFixed(2) : 0
            }%)`;
          } else if (params.dataIndex == 1) {
            return `${params.name} : <br/>${params.value} (${
              percentData[1] ? percentData[1].toFixed(2) : 0
            }%)`;
          } else if (params.dataIndex == 2) {
            return `${params.name} : <br/>${params.value} (${
              percentData[2] ? percentData[2].toFixed(2) : 0
            }%)`;
          }
        }
      },
      color: this.state.myColor,
      series: [
        {
          type: 'pie',
          symbol: 'circle',
          radius: ['30%', '75%'],
          center: ['48%', '50%'],
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
          data: dataArray
        },
        {
          type: 'pie',
          radius: ['75%', '85%'],
          center: ['48%', '50%'],
          label: {
            normal: {
              show: false,
              textStyle: {
                fontSize: 24,
                color: '#FFAA00'
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
          data: dataArray
        }
      ]
    };
    this.setState({
      option,
      data: dataArray
    })
  }

  render() {
    let { option, data, myColor, total } = this.state;
    return (
      <div className="object-map-label">
        <EchartsReact
          option={option}
          style={{ height: 'calc(100% - 32px)', width: '60%' }}
        />
        <div
          className="legends"
          style={{ height: 'calc(100% - 32px)', width: '40%' }}
        >
          {data.map((v, x) => (
            <div key={x}>
              <i style={{ backgroundColor: myColor[x] }} className="symbolC" />
              <span className="name">{v.name} ： </span>
              <div className="num">
                {Utils.splitNum(v.value)}({v.value ? ((v.value / total) * 100).toFixed(2): 0}
                %)
              </div>
            </div>
          ))}
        </div>
        <style jsx="true">{`
          .object-map-label {
            width: 290px;
            height: 190px;
            position: relative;
            display: flex;
            align-items: center;
          }
          .legends {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
          }
          .symbolC {
            display: inline-block;
            width: 12px;
            height: 12px;
            vertical-align: middle;
            border-radius: 50%;
            margin-right: 5px;
          }
          .name {
            font-size: 12px;
          }
          .num {
            margin-left: 20px;
            line-height: 14px;
            margin-bottom: 6px;
            font-size: 12px;
            font-family: ResourceNormal;
          }
        `}</style>
      </div>
    );
  }
}
export default ObjectMapLabel;
