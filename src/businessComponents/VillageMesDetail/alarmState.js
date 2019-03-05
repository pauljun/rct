import React, { Component } from 'react';

 const EchartsReact = Loader.loadModuleComponent('EchartsReact', 'default');
class ResourceTendencyStatic extends Component {
    getOtionTem() {
        let {dataByDaysList} = this.props;
        const totalRecource=dataByDaysList.length>0?dataByDaysList:[0,0,0,0,0,0,0];
        //近一周的日期数组
        const weekDays = [Utils.getDay(-7),Utils.getDay(-6),Utils.getDay(-5),Utils.getDay(-4),Utils.getDay(-3),Utils.getDay(-2),Utils.getDay(-1)]
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                confine: true
            },
            grid:{
                x:63,
                y:10,
                x2:30,
                y2:20,
                borderWidth:0
            },
             xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                axisTick:false,
                axisLine:{
                    show:false,
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#333333'
                    }
                } ,
                splitLine:{
                    lineStyle: {
                        color: ['#D8DCE3']
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: weekDays,
                axisTick:false,
                axisLine:{
                    show:false,
                },
                axisLabel: {
                    interval:0,
                    show: true,
                    textStyle: {
                        color: '#333333'
                    }
                }
            },
            series: [
                {
                    barWidth: 4,
                    barGap: 0.8,
                    name: '每日人脸抓拍数',
                    type: 'bar',
                    label: {
                        emphasis: {
                            show: true,
                            position: 'right',
                            textStyle: {
                                fontSize: '12',
                                color: ' #8899BB'
                            }
                        }
                    },
                    data: totalRecource,
                    itemStyle:{
                        normal:{color:' #8899BB'},
                    },
                }
            ]
        };

        return option;
    }
    render() {
        let {cardLength} = this.props
        return (
            <div className='chartAnother'>
                <EchartsReact option={this.getOtionTem()} style={{height:'calc(100% - 32px)'}}/>
            </div>
        )
    }
}
export default ResourceTendencyStatic;