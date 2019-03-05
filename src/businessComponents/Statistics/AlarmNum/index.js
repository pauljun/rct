import React, { Component } from 'react';
import { observer} from 'mobx-react';
const EchartsReact = Loader.loadModuleComponent('EchartsReact','default');

@Decorator.errorBoundary
@observer
class AlarmNum extends Component {
	state = {
		AlarmByDayStatis: []
	};
	componentWillMount() {
		const startTime = new Date(Utils.getDayYMD(-7)).getTime();
		const endTime = new Date(Utils.getDayYMD(0)).getTime();
		Service.statistics.countAlarmResultsTrendByHandleType({statisticsType: 0, startTime, endTime, alarmTypes:["1","2","5"] }).then((res) => {
			this.setState({ AlarmByDayStatis: res.data || []});
		});
	}

	getOtionTem = () => {
		let { AlarmByDayStatis } = this.state;
		let noHandleRecource = AlarmByDayStatis.unHandledAlarm ? AlarmByDayStatis.unHandledAlarm.map((v) => v.count) : [];
		let effectiveRecource = AlarmByDayStatis.effectiveAlarm ? AlarmByDayStatis.effectiveAlarm.map((v) => v.count) : [];
		let unEffectiveRecource = AlarmByDayStatis.ineffectiveAlarm ? AlarmByDayStatis.ineffectiveAlarm.map((v) => v.count) : [];
		let maxNum=Math.max(...noHandleRecource,...effectiveRecource,...unEffectiveRecource)
		let base=maxNum>10000?10000:(maxNum>1000?1000:1)
 		let qu=maxNum>10000?'万':(maxNum>1000?'千':'')
		noHandleRecource=noHandleRecource.map(v => v/base)
		effectiveRecource=effectiveRecource.map(v => v/base)
		unEffectiveRecource=unEffectiveRecource.map(v => v/base)
		
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
				trigger: 'axis',
				confine:true,
				// 坐标轴指示器，坐标轴触发有效
				axisPointer: {
					// 默认为直线，可选为：'line' | 'shadow'
					type: 'shadow'
				}
			},
			legend: {
				// y:'bottom',
				orient: 'horizontal',
				icon: 'rect',
				itemGap: 6,
				itemWidth: 20,
				itemHeight: 8,
				bottom: 10,
				data: [
					{
						name: '未处理警情',
						textStyle: { color: '#666' }
					},
					{
						name: '有效警情',
						textStyle: { color: '#666 ' }
					},
					{
						name: '无效警情',
						textStyle: { color: '#666' }
					}
				]
			},
			grid: {
				x: 30,
				y: 10,
				x2: 50,
				y2: 60,
				borderWidth: 0
			},
			// grid: {
			//     left: '3%',
			//     right: '4%',
			//     bottom: '3%',
			//     containLabel: true
			// },
			xAxis: {
				type: 'value',
				minInterval: base<1000?1:'',
				name:qu,
				nameLocation :'end',
				inverse: true,
				axisTick: {
					show: false
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: [ 'rgba(108,104,163,0.30)' ]
					}
				},
				axisLabel: {
					show: true,
					textStyle: {
						color: '#666'
					}
				},
				splitLine: {
					lineStyle: {
						color: [ 'rgba(108,104,163,0.30)' ]
					}
				}
			},
			yAxis: {
				type: 'category',
				data: weekDays,
				axisTick: {
					show: false
				},
				axisLine: {
					show: false
				},
				position: 'right',
				axisLabel: {
					show: true,
					textStyle: {
						color: '#666'
					}
				}
			},
			series: [
				{
					barWidth: 12,
					name: '未处理警情',
					type: 'bar',
					stack: '总量',
					label: {
						emphasis: {
							show: true,
							position: 'inside',
							textStyle: {
								fontSize: '12',
								color: '#FFF'
							}
						}
					},
					itemStyle: {
						normal: { color: '#5A60A2' }
					},
					data: noHandleRecource
				},
				{
					name: '有效警情',
					type: 'bar',
					stack: '总量',
					label: {
						emphasis: {
							show: true,
							position: 'bottom',
							textStyle: {
								fontSize: '12',
								color: '#5990D6 '
							}
						}
					},
					itemStyle: {
						normal: { color: '#8899BB ' }
					},
					data: effectiveRecource
				},
				{
					name: '无效警情',
					type: 'bar',
					stack: '总量',
					label: {
						emphasis: {
							show: true,
							position: 'top',
							textStyle: {
								fontSize: '12',
								color: '#50D6BD'
							}
						}
					},
					itemStyle: {
						normal: { color: '#FFAA00' }
					},
					data: unEffectiveRecource
				}
			]
		};

		return option;
	}
	render() {
		return <EchartsReact option={this.getOtionTem()} style={{ height: 'calc(100% - 32px)' }} />;
	}
}
export default AlarmNum;
