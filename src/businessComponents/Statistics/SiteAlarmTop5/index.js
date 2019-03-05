import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

const EchartsReact = Loader.loadModuleComponent('EchartsReact','default');

@Decorator.errorBoundary
@observer
class PlaceAlarmNumb extends Component {
    state={
        EAPStatisData:[]
    }
    componentDidMount(){
        Service.statistics.countEffectiveAlarmResultsInPlaces({
            alarmTypes: ['1','2','4','5']
        }).then((res) => {
            this.setState({EAPStatisData:res.data || []})
            })
    }
    getOtionTem =() => {
        let {EAPStatisData} = this.state;
        let codeSource = [], dataSource = []
        if(EAPStatisData.length > 0){
            let arr = EAPStatisData
                .map(d => { return {code:d.placeCode,total:d.count}})
                .sort((a,b) => b.total-a.total)
                .slice(0,5)
            arr.map(v => {
                codeSource.push(Dict.getLabel('placeType', v.code))
                dataSource.push(v.total)
                return v
            })
        }
        const option = {
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
				confine:true,
                // 坐标轴指示器，坐标轴触发有效
                axisPointer : {   
                    // 默认为直线，可选为：'line'  | 'shadow'         
                    type : 'shadow'        
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top:'20',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data: codeSource,
                    axisTick:false,
                    axisLine:{
                        show:false,
                    },
                    axisLabel:{
                        show: true,
                        textStyle:{
                            color: '#666',
                            fontSize: '12',
                            width: 50
                        }
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    minInterval: 1,
                    position:'right',
                    axisTick: {
                        show:false,
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
                    } ,
                    splitLine:{
                        lineStyle: {
                            color: ['rgba(108,104,163,0.30)']
                        }
                    }
                }
            ],
            series : [
                {
                    type: 'pictorialBar',
                    barWidth: '60%',
                    symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',
                    label: {
                        emphasis: {
                            // backgroundColor:'#f03b56',
                            // width:'50px',
                            // height:'50px',
                            // padding:[4,6],
                            // borderRadius:4,
                            show: true,
                            position: 'top',
                            textStyle: {
                                fontSize: '14',
                                color: '#FF5C3C'
                            }
                        }
                    },
                    data: dataSource,
                    itemStyle: {
                        normal: {
                            color:{
                                type: 'linear',
                                x: 0,y: 0,x2: 0,y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#8D96A9 ' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#9FA8B8 ' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        },
                        emphasis: {
                            color:{
                                type: 'linear',
                                x: 0,y: 0,x2: 0,y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#FFAA00  ' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#FF8800 ' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        },
                    },
                }
            ]
        };
                 
        return option;
      }
    render () {
        return (
            <EchartsReact 
                key={Math.random()} 
                option={this.getOtionTem()} 
                style={{height:'calc(100% - 32px)'}}
            />
        )
    }
}
export default PlaceAlarmNumb;