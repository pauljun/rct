import React from 'react';
import { Radio } from 'antd';
import moment from 'moment';
import './index.less';

const RadioGroup = Radio.Group;
const IconFont = Loader.loadBaseComponent('IconFont');
const EchartsReact = Loader.loadModuleComponent('EchartsReact', 'default');

class TravelRule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 1,
      option: {}
    };
  }
  componentDidMount() {
    this.getTraveRule(1);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.travelList !== this.props.travelList) {
      this.getOtionTem(nextProps.travelList);
    }
  }
  getOtionTem(parms) {
    const { type } = this.state;
    let typeList = [
      {
        name: '当前周',
        textStyle: { color: '#FFAA00' }
      },
      {
        name: '上一周',
        textStyle: { color: '#25DC9B' }
      },
      {
        name: '平均',
        textStyle: { color: '#B5BBC7' }
      }
    ];
    let series = [
      {
        name: '当前周',
        type: 'line',
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: {
          color: '#ffaa00'
        },
        itemStyle: {
          normal: {
            color: '#ffaa00',
            borderWidth: 2,
            borderColor: '#fff'
          }
        },
        data: []
      },
      {
        name: '上一周',
        type: 'line',
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: {
          color: '#25dc9b'
        },
        itemStyle: {
          normal: {
            color: '#25dc9b',
            borderWidth: 2,
            borderColor: '#fff'
          }
        },
        data: []
      },
      {
        name: '平均',
        type: 'line',
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: {
          color: '#b5bbc7'
        },
        itemStyle: {
          normal: {
            color: '#b5bbc7',
            borderWidth: 2,
            borderColor: '#fff'
          }
        },
        data: []
      }
    ];
    let xAxisData = [
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
      '星期日'
    ];
    if (type === 1) {
      typeList[0].name = '当天';
      series[0].name = '当天';
      typeList[1].name = '前一天';
      series[1].name = '前一天';
      xAxisData = [
        '凌晨\n03:00~05:00',
        '早晨\n05:00~08:00',
        '上午\n08:00~12:00',
        '中午\n12:00~14:00',
        '下午\n14:00~18:00',
        '傍晚\n18:00~19:00',
        '晚上\n19:00~23:00',
        '深夜\n23:00~03:00'
      ];
    }
    if (type === 30) {
      typeList[0].name = '当月';
      series[0].name = '当月';
      typeList[1].name = '前一月';
      series[1].name = '前一月';
      let arr = [];
      for (let i = 0; i < 31; i++) {
        arr[i] = i + 1;
      }
      xAxisData = arr;
    }
    parms.map((item, index) => {
      series[index].data = item;
    });
    let option = {
      color: ['#FFAA00', '#25DC9B', '#B5BBC7'],
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
        data: typeList
      },
      grid: {
        left: 60,
        right: 60,
        bottom: 70,
        top: 50
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
            width: 2
          }
        },
        axisLabel: {
          color: '#666',
          fontSize: 12,
          fontFamily: 'Microsoft YaHei'
        },
        axisLine: {
          show: false
        },
        // data: ['星期\n一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日',]
        data: xAxisData
      },
      yAxis: {
        type: 'value',
        axisTick: false,
        name: '次',
        axisLine: {
          show: false
        },
        axisLabel: {
          color: '#666',
          fontSize: 12,
          fontFamily: 'Microsoft YaHei'
        },
        splitLine: {
          show: false
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['#F3F6F9', '#fff']
          }
        }
      },
      series: series
    };
    this.setState({
      option
    });
  }
  getTraveRule = type => {
    const { queryTravelRuleByMouth, queryActivityRuleOneDay } = this.props;
    if (type === 1) {
      let option = {
        startTime: moment(moment().subtract(2, 'd').format('YYYY-MM-DD'),moment.ISO_8601).valueOf(),
        endTime: moment(moment().format('YYYY-MM-DD'),moment.ISO_8601).valueOf()
      };
      queryActivityRuleOneDay(option);
    }
    if (type === 7) {
      queryTravelRuleByMouth(7);
    }
    if (type === 30) {
      queryTravelRuleByMouth(30);
    }
    this.setState({ type: type });
  };
  onChange = e => {
    this.getTraveRule(e.target.value);
  };

  render() {
    const { option } = this.state;
    return (
      <div className="trave-rule">
        <div className="rule-header">
          <div className="header-title">出行规律：</div>
          <div className="header-filtter">
            <RadioGroup defaultValue={1} onChange={this.onChange}>
              <Radio value={1}>天</Radio>
              <Radio value={7}>周</Radio>
              <Radio value={30}>月</Radio>
            </RadioGroup>
          </div>
        </div>
        <div className="rule-content">
          <EchartsReact
            option={option}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    );
  }
}

export default TravelRule;
