import React, { Component } from 'react';
import { observer } from 'mobx-react';
import * as _ from 'lodash';

const EchartsReact = Loader.loadModuleComponent('EchartsReact', 'default');
const IconFont = Loader.loadBaseComponent('IconFont');

@Decorator.errorBoundary
@observer
class Tags extends Component {
  getOtionTem() {
    let { data, myColor, singleTag } = this.props;
    let total = _.sum(data.map(v => v.value || v.count)) || '';
    let singleData = [data[0], { name: '总数', value: total - data[0].value }];
    const option = {
      color: myColor,
      series: [
        {
          type: 'pie',
          symbol: 'circle',
          radius: ['80%', '100%'],
          center: ['50%', '50%'],
          hoverAnimation: false,
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
          data: !singleTag ? data : singleData
        }
      ]
    };
    return option;
  }

  render() {
    let { data, myColor, icon, singleTag } = this.props;
    let total = _.sum(data.map(v => v.value || v.count)) || '';
    return (
      <div className="chart">
        <EchartsReact
          option={this.getOtionTem()}
          style={{ height: '100px', width: '100px' }}
        />
        <div className="legends" style={{ width: '150px' }}>
          {!singleTag &&
            data.map((v, x) => (
              <div key={x}>
                <i
                  style={{ backgroundColor: myColor[x] }}
                  className="symbolC"
                />
                <span className="name">{v.name}：</span>
                <span className="num">{v.value}</span>
              </div>
            ))}
          <div className="center">
            <IconFont className="tags-icon" type={`${icon}`} />
            {singleTag ? (
              <span className="total">
               {total > 0 ? parseInt((data[0].value / total) * 100 ): 0}%
              </span>
            ) : (
              <span className="total">{total}</span>
            )}
          </div>
        </div>
        {singleTag && <div className="singleTag">{data[0].name}</div>}

        <style jsx="true">{`
          .chart {
            position: relative;
          }
          .legends {
            display: flex;
            // padding-left: ${singleTag ? 0 : 16}px;
            margin-top: 16px;
            flex-direction: column;
            justify-content: space-around;
          }
          .legends .singleTag {
            color: #333;
            font-size: 14px;
            text-align: center;
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
            line-height: 14px;
            margin-bottom: 6px;
            font-size: 12px;
          }
          .center {
            position: absolute;
            top: 25px;
            left: 34px;
          }
          .center .tags-icon {
            color: #8899bb;
          }
          .center i {
            font-size: 32px;
          }
          .center span {
            display: block;
            color: #ff8800;
            font-size: 14px;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }
}
export default Tags;
