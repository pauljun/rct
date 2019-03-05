import React, { Component } from 'react';
import { observer } from 'mobx-react';

const EchartsReact = Loader.loadModuleComponent('EchartsReact','default');
const IconFont=Loader.loadBaseComponent('IconFont')
const {znxj, qj, zpj, db }=Dict.map

@Decorator.errorBoundary
@observer
class ObjectMapAge extends Component {
  state = {
    total: 0,
    data: [
      { value: 0, name: '小孩' },
      { value: 0, name: '中青年' },
      { value: 0, name: '老人' },
    ],
    option:{},
    myColor: ['#b5bbc7 ', '#ffba00', '#d8dce3']
  };

  componentWillMount() {
   const { data } = this.props;
   let type = ['118401', '118402', '118403', '118404'];
   let arr = [];
   type.map((v, index) => {
     let findData = data.find(item => item.tag === v );
      if(!findData) {
        arr.push(0);
      } else {
        arr.push(findData.count)
      }
   });
   arr[1] = arr[1] + arr[2];
   arr[2] = arr[3];
   arr.length = 3;
   this.getOtionTem(arr);
  }
  getValue = data => {
    let count = 0;
    data &&
      data.map(v => {
        count += v.num;
      });
    return count;
  };
  getOtionTem(arr) {
    let { data, myColor } = this.state;
    const total = arr.reduce((a, b) => a + b);
    data.map((v, index) => {
      v.value = arr[index];
      v.percentData = 100 * arr[index] / total
    });
    const option = {
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: function(params) {
          if (params.dataIndex == 0) {
            return `${params.name} : <br/>${params.value} (${
              data[0].percentData ? data[0].percentData.toFixed(2) : 0
            }%)`;
          } else if (params.dataIndex == 1) {
            return `${params.name} : <br/>${params.value} (${
              data[1].percentData ? data[1].percentData.toFixed(2) : 0
            }%)`;
          } else if (params.dataIndex == 2) {
            return `${params.name} : <br/>${params.value} (${
              data[2].percentData ? data[2].percentData.toFixed(2) : 0
            }%)`;
          }
        }
      },
      color: myColor,
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
          data: data
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
          data: data
        }
      ]
    };
    this.setState({
      option,
      total
    })
    // return option;
  }

  render() {
    let { data, myColor, total, option } = this.state;
    return (
      <div className="object-map-age">
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
          .object-map-age {
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
export default ObjectMapAge;
