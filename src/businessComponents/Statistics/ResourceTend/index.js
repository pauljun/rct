import React, { Component } from 'react';
import { observer } from 'mobx-react';

const EchartsReact = Loader.loadModuleComponent('EchartsReact','default');

@Decorator.errorBoundary
@observer
class ResourceTendencyStatic extends Component {
	state = {
		vehicleNumRecource: [],
		bodyNumRecource: [],
		faceNumRecource: []
	};
	resourcesTrendStatis = [];
	componentWillMount() {
		Promise.all([
			Service.statistics.countPersonDayTrend({days:7,hours:24,type:0}),
			Service.statistics.countByDays({endTime:new Date().getTime(),startTime:new Date().getTime() - 7 * 24 * 60 * 60 * 1000})
		])
		.then((res) => {
					this.setState({
						vehicleNumRecource: res[1].data.map((v) => v.count),
						bodyNumRecource: res[0].data.list.map((v) => v.bodyCount),
						faceNumRecource: res[0].data.list.map((v) => v.faceCount)
					});
		});
	}
	getOtionTem() {
		let { vehicleNumRecource, bodyNumRecource, faceNumRecource } = this.state;
		let maxNum=Math.max(...vehicleNumRecource,...bodyNumRecource,...faceNumRecource)
		let base=maxNum>10000?10000:(maxNum>1000?1000:1)
		let qu=maxNum>10000?'万':(maxNum>1000?'千':'')
		let faceNumRecources=faceNumRecource.map(v => v/base)
		let bodyNumRecources=bodyNumRecource.map(v => v/base)
		let vehicleNumRecources=vehicleNumRecource.map(v => v/base)
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
				axisPointer: {
					type: 'shadow'
				},
				confine: true
			},
			grid: {
				x: 50,
				y: 10,
				x2: 30,
				y2: 60,
				borderWidth: 0
			},
			legend: {
				orient: 'horizontal',
				icon: 'rect',
				itemGap: 6,
				itemWidth: 20,
				itemHeight: 4,
				bottom: 10,
				data: [
					{
						name: '人脸数',
						textStyle: { color: '#666' }
					},
					{
						name: '人体数',
						textStyle: { color: '#666' }
					},
					{
						name: '机动车数',
						textStyle: { color: '#666' }
					}
				]
			},
			xAxis: {
				type: 'value',
				name:qu,
				minInterval: base<1000?1:'',
				nameLocation :'end',
				boundaryGap: [ 0, 0.05 ],
				axisTick: false,
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
				axisTick: false,
				axisLine: {
					show: false
				},
				axisLabel: {
					show: true,
					textStyle: {
						color: '#666'
					}
				}
			},
			series: [
				{
					barWidth: 6,
					barGap: 0.5,
					name: '人脸数',
					type: 'bar',
					label: {
						emphasis: {
							show: true,
							position: 'right',
							textStyle: {
								fontSize: '12',
								color: '#5A60A2'
							}
						}
					},
					data: faceNumRecources,
					itemStyle: {
						normal: { color: '#5A60A2' }
					}
				},
				{
					barWidth: 6,
					barGap: 0.5,
					name: '人体数',
					type: 'bar',
					label: {
						emphasis: {
							show: true,
							position: 'right',
							textStyle: {
								fontSize: '12',
								color: '#8899BB'
							}
						}
					},
					data:bodyNumRecources ,
					itemStyle: {
						normal: { color: '#8899BB' }
					}
				},
				{
					barWidth: 6,
					barGap: 0.5,
					name: '机动车数',
					type: 'bar',
					label: {
						emphasis: {
							show: true,
							position: 'right',
							textStyle: {
								fontSize: '12',
								color: '#FFAA00'
							}
						}
					},
					data:vehicleNumRecources ,
					itemStyle: {
						normal: { color: '#FFAA00' }
					}
				}
			]
		};

		return option;
	}
	render() {
		return <EchartsReact option={this.getOtionTem()} style={{ height: 'calc(100% - 32px)' }} />;
	}
}
export default ResourceTendencyStatic;
