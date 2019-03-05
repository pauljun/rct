import React from "react";

const EchartsReact = Loader.loadModuleComponent("EchartsReact", "default");
export default class PeopleTrendChart extends React.Component {
  getOtionTem() {
    let { peopleTrendList } = this.props;
    let {dayTrend,titleArr} = this.props;
    const vehicleNumRecource = [24, 14, 32, 67, 34, 3, 34, 54];
    const bodyNumRecource = [13, 17, 28, 32, 234, 13, 34, 54];
    const faceNumRecource = [71, 15, 28, 32, 24, 31, 34, 54];
    //数据量过大时，防止纵坐标文本显示越界
    let chartLeft = 50;
    let dataSet = [
      ...bodyNumRecource,
      ...faceNumRecource,
      ...vehicleNumRecource
    ];
    if (dataSet.length > 0) {
      let maxData = Math.max(...dataSet);
      if (maxData.toString().length > 5) {
        chartLeft += (maxData.toString().length - 5) * 10;
      }
    }
    const option = {
      color: ["#6B72C0", "#6B72C0", "#FFAA00"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
          shadowStyle: {
            color: "rgba(255,136,0,0.20)"
          }
        },
        confine: true
      },
      legend: {
        icon: "rect",
        y: "bottom",
        itemGap: 6,
        itemWidth: 26,
        itemHeight: 2,
        data: [
          {
            name: titleArr[0],
            textStyle: { color: "#666" }
          },
          {
            name: titleArr[1],
            textStyle: { color: "#666 " }
          },
          {
            name: titleArr[2],
            textStyle: { color: "#666" }
          }
        ]
      },
      grid: {
        left: chartLeft,
        right: 20,
        bottom: 45,
        top: 20
      },
      xAxis: {
        type: "category",
        splitNumber: 24,
        boundaryGap: false,
        axisTick: false,
        splitLine: {
          show: true,
          lineStyle: {
            color: "rgba(108,104,163,0.30)"
          }
        },
        axisLabel: {
          color: "#666",
          fontSize: 12,
          fontFamily: "Microsoft YaHei"
        },
        axisLine: {
          show: false
        },
        data: dayTrend
      },
      yAxis: {
        type: "value",
        axisTick: false,
        axisLine: {
          show: false
        },
        axisLabel: {
          color: "#666",
          fontSize: 12,
          fontFamily: "Microsoft YaHei"
        },
        splitLine: {
          show: false
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ["rgba(108,104,163,0.08)", "rgba(0,0,0,0)"]
          }
        }
      },
      series: [
        {
          name: titleArr[0],
          type: "line",
          lineStyle: {
            color: "#6B72C0",
            shadowColor: "rgba(0, 0, 0, 0.2)",
            shadowBlur: 4,
            shadowOffsetY: 10
          },
          data: faceNumRecource
        },
        {
          name: titleArr[1],
          type: "line",
          lineStyle: {
            color: "#8899BB",
            shadowColor: "rgba(0, 0, 0, 0.2)",
            shadowBlur: 4,
            shadowOffsetY: 10
          },
          data: bodyNumRecource
        },
        {
          name: titleArr[2],
          type: "line",
          lineStyle: {
            color: "#FFAA00",
            shadowColor: "rgba(0, 0, 0, 0.2)",
            shadowBlur: 4,
            shadowOffsetY: 10
          },
          data: vehicleNumRecource
        }
      ]
    };

    return option;
  }
  render() {
    return (
      <EchartsReact
        option={this.getOtionTem()}
        style={{ width: "100%", height: "165px" }}
      />
    );
  }
}
