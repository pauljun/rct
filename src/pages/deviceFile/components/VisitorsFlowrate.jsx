import React from 'react';
import moment from "moment";
import { Radio } from "antd";
const RadioGroup = Radio.Group;
const { selectTime } = Dict.map;
const FrameCard = Loader.loadBusinessComponent("FrameCard");
const EchartsReact = Loader.loadModuleComponent('EchartsReact', 'default');
class TravelRule extends React.Component {

  change = (e) => {
    this.props.typeChange && this.props.typeChange(e.target.value);
  }
  getOtionTem() {
    let { type, data } = this.props
    let color = ['#FFAA00', '#25DC9B', '#B5BBC7']
    let seriesName = ['当前周', '上一周', '平均']
    let xAxisData = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日',]
    let dataList = [[], [], []]
    if (type === 2) {
      for (let i = 0; i < 7; i++) {
        dataList[0][i] = 0
        dataList[1][i] = 0
        dataList[2][i] = 0
      }
      let thisWeekFirstDay = moment().week(moment().week()).startOf('week') * 1
      data.countAvgPerson && data.countAvgPerson.map(v => {
        dataList[2][v.week - 1] = v.total;
        return dataList
      });
      data.countAvgPerson && data.countPerson.map(v => {
        if (moment(v.date) >= thisWeekFirstDay) {
          dataList[0][v.week - 1] = v.total;
        } else {
          dataList[1][v.week - 1] = v.total;
        }
        return dataList;
      })
    }
    if (type === 3) {
      let arr = [];
      for (let i = 0; i < 31; i++) {
        arr[i] = i + 1;
        dataList[0][i] = 0
        dataList[1][i] = 0
        dataList[2][i] = 0
      }
      let thisMonthFirstDay = moment().month(moment().month()).startOf('month') * 1
      data.countAvgPerson && data.countAvgPerson.map(v => {
        dataList[2][v.monthday - 1] = v.total;
      });
      data.countAvgPerson && data.countPerson.map(v => {
        if (moment(v.date) >= thisMonthFirstDay) {
          dataList[0][v.monthday - 1] = v.total;
        } else {
          dataList[1][v.monthday - 1] = v.total;
        }
      });
      seriesName = ['当前月', '上一月', '平均']
      xAxisData = arr
    }
    let series = []
    seriesName.map((v, k) => {
      series.push({
        name: v,
        type: "line",
        symbol: "circle",
        symbolSize: 7,
        lineStyle: {
          color: color[k]
        },
        itemStyle: {
          normal: {
            color: color[k],
            borderWidth: 2,
            borderColor: "#fff"
          }
        },
        data: dataList[k]
      });
      return series;
    })
    const option = {
      color: color,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(255,136,0,0.20)'
          }
        },
        confine: true
      },
      legend: {
        icon: 'rect',
        // y: 'bottom',
        itemGap: 48,
        itemWidth: 26,
        itemHeight: 2,
        bottom: 15,
        data: seriesName,
      },
      grid: {
        left: 60,
        right: 60,
        bottom: 70,
        top: 50,
      },
      xAxis: {
        type: 'category',
        splitNumber: 24,
        boundaryGap: ['20%', '20%'],
        axisTick: true,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#fff',
            width: 2,
          }
        },
        axisLabel: {
          color: '#666',
          fontSize: 12,
          fontFamily: 'Microsoft YaHei',
        },
        axisLine: {
          show: false,
        },
        data: xAxisData
      },
      yAxis: {
        type: 'value',
        axisTick: false,
        name: '人数',
        axisLine: {
          show: false,
        },
        axisLabel: {
          color: '#666',
          fontSize: 12,
          fontFamily: 'Microsoft YaHei',
        },
        splitLine: {
          show: false
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['#F3F6F9', '#fff']
          }
        },
      },
      series: series
    };

    return option;
  }
  render() {
    let { type } = this.props
    return <FrameCard title="人流量分布规律：" headerOperator={<RadioGroup options={selectTime.filter(v => { return v.value !== 1 })} onChange={this.change} value={type} />}>
      <div className="visitors-flowrate-info">
        <EchartsReact option={this.getOtionTem()} style={{ width: "100%", height: "100%" }} />
      </div>
    </FrameCard>;
  }
}

export default TravelRule