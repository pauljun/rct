import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

import "./index.less";

const EchartsReact = Loader.loadModuleComponent("EchartsReact", "default");

class AlarmStateEchart extends React.Component {
  static propTypes = {
    list: PropTypes.object
  };
  state = {
    chartList:  {
      keyPointCount: [],
      outSiderCount: [],
      privateNetCount: []
    }
  };
  componentWillMount() {
    let option = {
      alarmTypes: ["1", "2", "4"],
      statisticsType: 0
    };
    option.startTime = moment(
      moment()
        .subtract(7, "d")
        .format("YYYY MM DD")
    ).valueOf();
    option.endTime = moment(moment().format("YYYY MM DD")).valueOf();
    Service.statistics.countAlarmResultsTrendByAlarmType(option).then(res => {
      let chartList = {
        keyPointCount: [],
        outSiderCount: [],
        privateNetCount: []
      };
      res.data && res.data.length > 0 && res.data.map(v => {
        if (v.alarmType === '1') {
          chartList.keyPointCount = v.list.map(v => v.count);
        }
        if (v.alarmType === '2') {
          chartList.outSiderCount = v.list.map(v => v.count);
        }
        if (v.alarmType === '4') {
          chartList.privateNetCount = v.list.map(v => v.count);
        }
      });
      this.setState({
        chartList
      });
    });
  }
  getOtionTem() {
    let { chartList } = this.state;
    let { keyPointCount, outSiderCount, privateNetCount } = chartList;
    let maxNum = Math.max(
      ...keyPointCount,
      ...outSiderCount,
      ...privateNetCount
    );
    let unit = maxNum > 1000 ? "千" : "";
    let base = maxNum > 1000 ? 1000 : 1;
    keyPointCount = keyPointCount.map(v => v / base);
    outSiderCount = outSiderCount.map(v => v / base);
    privateNetCount = privateNetCount.map(v => v / base);
    //近一周的日期数组
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
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        },
        confine: true
      },
      grid: {
        x: 63,
        y: 10,
        x2: 30,
        y2: 43,
        borderWidth: 0
      },
      legend: {
        orient: "horizontal",
        icon: "rect",
        itemGap: 6,
        itemWidth: 20,
        itemHeight: 4,
        bottom: -5,
        // padding: [0,0,50,0],
        pageButtonGap: 1,
        data: [
          {
            name: "重点人员",
            textStyle: { color: " #333333" }
          },
          {
            name: "外来人员",
            textStyle: { color: "#333333" }
          },
          {
            name: "专网套件",
            textStyle: { color: "#333333" }
          }
        ]
      },
      xAxis: {
        type: "value",
        minInterval: 1,
        boundaryGap: [0, 0.1],
        name: unit,
        nameLocation: "end",
        axisTick: false,
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: "#333333"
          }
        },
        splitLine: {
          lineStyle: {
            color: ["#D8DCE3"]
          }
        }
      },
      yAxis: {
        type: "category",
        data: weekDays,
        axisTick: false,
        axisLine: {
          show: false
        },
        axisLabel: {
          interval: 0,
          show: true,
          textStyle: {
            color: "#333333"
          }
        }
      },
      series: [
        {
          barWidth: 4,
          barGap: 0.8,
          name: "重点人员",
          type: "bar",
          label: {
            emphasis: {
              show: true,
              position: "right",
              textStyle: {
                fontSize: "12",
                color: "#5A60A2"
              }
            }
          },
          data: keyPointCount,
          itemStyle: {
            normal: { color: "#5A60A2" }
          }
        },
        {
          barWidth: 4,
          barGap: 0.8,
          name: "外来人员",
          type: "bar",
          label: {
            emphasis: {
              show: true,
              position: "right",
              textStyle: {
                fontSize: "12",
                color: "#8899BB"
              }
            }
          },
          data: outSiderCount,
          itemStyle: {
            normal: { color: "#8899BB" }
          }
        },
        {
          barWidth: 4,
          barGap: 0.8,
          name: "专网套件",
          type: "bar",
          label: {
            emphasis: {
              show: true,
              position: "right",
              textStyle: {
                fontSize: "12",
                color: "#FFAA00"
              }
            }
          },
          data: privateNetCount,
          itemStyle: {
            normal: { color: "#FFAA00" }
          }
        }
      ]
    };

    return option;
  }
  render() {
    return (
      <div className="alarm-state-echart">
        <EchartsReact
          option={this.getOtionTem()}
          style={{ height: "calc(100% - 16px)", width: "100%" }}
        />
      </div>
    );
  }
}
export default AlarmStateEchart;
