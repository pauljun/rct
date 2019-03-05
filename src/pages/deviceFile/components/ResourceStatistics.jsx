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
    let { vehicleResource,faceResource,bodyResource ,type} = this.props
    let color = ["#FFAA00", "#25DC9B", "#B5BBC7"];
    let seriesName = ['人脸', '人体', '车辆']
    let xAxisData = []
    let dataList = [[], [], []]
    let time = 7;
    if (type === 3) {
      time=31
    }
    for (let i = time-1; i >=0; i--) {
      let item = moment(new Date() * 1 - (i + 1)* 24 * 60 * 60 * 1000).format('YYYY-MM-DD')
      xAxisData.push(item);
      dataList[0][i] = faceResource.find(v => { return v.time === item }) ? faceResource.find(v => { return v.time === item }).faceCount:0
      dataList[1][i] = bodyResource.find(v => { return v.time === item }) ? bodyResource.find(v => { return v.time === item }).bodyCount : 0
      dataList[2][i] = vehicleResource.find(v => { return v.time === item }) ? vehicleResource.find(v => { return v.time === item }).count : 0
    }
    if(type===3){
      xAxisData = xAxisData.map(v => {
        let item = Number(v.substring(v.length - 2, v.length) )
        if (item===1){
          return v = `${Number(v.substring(v.length - 5, v.length-3))}月`
        }else{
          return v = item
        }
      })
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
        name: '数量',
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
    return <FrameCard title="​抓拍资源统计：" headerOperator={<RadioGroup options={selectTime.filter(v => { return v.value !== 1 })} onChange={this.change} value={type} />}>
      <div className="visitors-flowrate-info">
        <EchartsReact option={this.getOtionTem()} style={{ width: "100%", height: "100%" }} />
      </div>
    </FrameCard>;
  }
}

export default TravelRule