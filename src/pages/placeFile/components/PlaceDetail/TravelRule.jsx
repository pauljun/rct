import React from 'react';
import moment from "moment";
import { Radio } from "antd";
const RadioGroup = Radio.Group;
const { selectTime } = Dict.map;
const FrameCard = Loader.loadBusinessComponent("FrameCard");
const EchartsReact = Loader.loadModuleComponent('EchartsReact', 'default');
class TravelRule extends React.Component {
  change = (e ) => {
    this.props.countPersonFrequencyTypeChange && this.props.countPersonFrequencyTypeChange(e.target.value);
  }
  //前位补0 并余24 
  add0 = num => {
    num = num%24
    if(num<10){
      num = '0'+num
    }
    return num;
  }
  getOtionTem() {
    let { type, data} = this.props
    let seriesName=['当天','前一天','平均']
    let xAxisData = [];
    //'凌晨\n03:00~05:00', '早晨\n05:00~08:00', '上午\n08:00~12:00', '中午\n12:00~14:00', '下午\n14:00~18:00', '傍晚\n18:00~19:00', '晚上\n19:00~23:00', '深夜\n23:00~03:00'
    let color = ['#FFAA00', '#25DC9B', '#B5BBC7']
    let dataList = [[], [], []]
    if( type === 1){
      let timeScale=[
        { time: [3,4], value: '凌晨' },
        { time: [5,6,7], value: '早晨' },
        { time: [8,9,10,11], value: '上午' },
        { time: [12,13], value: '中午' },
        { time: [14,15,16,17], value: '下午' },
        { time: [18], value: '傍晚' },
        { time: [19,20,21,22], value: '晚上' },
        { time: [23,0,1,2], value: '深夜' },
      ]
      for (let i = 0; i < 8; i++) {
        dataList[0][i] = 0
        dataList[1][i] = 0
        dataList[2][i] = 0
      }
      let toDay = moment().format('YYYY-MM-DD')
      let yesterDay = moment().subtract(1, 'days').format('YYYY-MM-DD')
      timeScale.map((v,k) => {
        xAxisData.push(`${v.value}\n${this.add0(v.time[0])}:00~${this.add0(v.time[v.time.length-1]+1)}:00`);
        v.time.map(x => {
          if (data.countAvgPerson && data.countAvgPerson[0]){
            dataList[2][k] += data.countAvgPerson[0][`h${this.add0(x)}`];
          }
          if (data.countPerson&&data.countPerson.find(v => { return v.date === toDay})){
            dataList[0][k] += data.countPerson.find(v => { return v.date === toDay })[`h${this.add0(x)}`];
          }
          if (data.countPerson&&data.countPerson.find(v => { return v.date === yesterDay })) {
            dataList[1][k] += data.countPerson.find(v => { return v.date === yesterDay })[`h${this.add0(x)}`];
          }
        })
        return dataList;
      })
      // data.countAvgPerson && data.countAvgPerson.map(v => {
      //   return dataList
      // });
    }
    if (type === 2) {
      for (let i = 0; i < 7; i++) {
        dataList[0][i] = 0
        dataList[1][i] = 0
        dataList[2][i] = 0
      }
      let thisWeekFirstDay = moment().week(moment().week()).startOf('week') * 1
      data.countAvgPerson && data.countAvgPerson.map(v => {
        dataList[2][v.week === 1 ? 6:v.week - 1] = v.total;
        return dataList
      });
      data.countAvgPerson && data.countPerson.map(v => {
        if (moment(v.date) >= thisWeekFirstDay) {
          dataList[0][v.week === 1 ? 6 : v.week - 2] = v.total;
        } else {
          dataList[1][v.week === 1 ? 6 : v.week - 2] = v.total;
        }
        return dataList;
      })
      seriesName = ['当前周', '上一周', '平均']
      xAxisData = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日',]
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

    let series=[]
    seriesName.map((v,k) => {
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
        bottom :15,
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
            width:2,
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
        name:'人次',
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
            color: ['#F3F6F9','#fff']
          }
        },
      },
      series: series
    };

    return option;
  }
  render() {
    let {type} = this.props
    return(
      <FrameCard
        title="人员出入规律："
        headerOperator={
          <RadioGroup options={selectTime} onChange={this.change} value={type} />
        }
      >
        <div className="visitors-flowrate-info">
          <EchartsReact option={this.getOtionTem()} style={{ width: '100%', height: '100%' }} />
        </div>
      </FrameCard>
    ) 
  }
}

export default TravelRule