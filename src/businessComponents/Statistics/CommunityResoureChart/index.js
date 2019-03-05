import React, { Component } from "react";
import { observer } from "mobx-react";
import * as _ from "lodash";

const EchartsReact = Loader.loadModuleComponent("EchartsReact", "default");
const IconFont = Loader.loadBaseComponent("IconFont");

@Decorator.errorBoundary
@observer
class CommunityResourceChart extends Component {
  getOtionTem() {
    let { data, myColor} = this.props;
    const option = {
      color: myColor,
      series: [
        {
          type: "pie",
          symbol: "circle",
          radius: ["83%", "100%"],
          center: ["50%", "50%"],
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
          data: data
        }
      ]
    };
    return option;
  }

  render() {
    let { data, myColor, icon, filterData,resource } = this.props;
    return (
      <div className="chart">
        <EchartsReact
          option={this.getOtionTem()}
          style={{ height: "100px", width: "100px" }}
        />
        <div className={`community-legends ${resource?"resource":''}`} style={{ width: "180px" }}>
          {filterData &&
            filterData.map((v, x) => (
              <div key={x} className="out-style">
              <IconFont type={v.icon} theme="outlined" className="icon-size"/>
                <i
                  style={{ backgroundColor: myColor[x] }}
                  className="symbolC"
                />
                <span className="name">{v.name}</span>
                <span className="community-chart-right-num">{v.value}</span>
              </div>
            ))}
        </div>

        <style jsx="true">{`
        .out-style{
          margin-bottom:12px;
        }
          .community-legends {
            display: flex;
            padding-left: ${filterData ? 0 : 16}px;
            margin-bottom: 16px;
            flex-direction: column;
            position:absolute;
            top:0;
            left:124px;
          }
          .resource{
            top:0px;
          }
          .legends .singleTag {
            color: #333;
            font-size: 14px;
            text-align: center;
          }
          .icon-size{
            font-size:24px;
            position:absolute;
            color:#8899BB;
          }
          .symbolC {
            display: inline-block;
            width: 8px;
            height: 8px;
            vertical-align: middle;
            border-radius: 50%;
            margin-right: 5px;
            margin-left:32px;
          }
          .name {
            font-size: 12px;
            display:inline-block;
            width:60px;
            color:#333333;
          }
          .community-chart-right-num {
            line-height: 14px;
            display:inline-block;
            font-size: 16px;
            width:40px;
            text-align:right;
          }
        `}</style>
      </div>
    );
  }
}
export default CommunityResourceChart;
