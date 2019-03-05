import React from "react";
import {Radio } from "antd";
import "./communityChart.less";

let daytitle=[ "凌晨","早晨","上午","中午","下午","傍晚","晚上","深夜"];
let weektitle=["周一","周二","周三","周四","周五","周六","周日"];
let monthtitle=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]
const PeopleAccessTrend = Loader.loadBusinessComponent('Statistics','PeopleAccessTrend')
export default class StaticChart extends React.Component {
  state = {
    dayResouecesStatis: [],
    titleArr:["平均","当天","前天"],
    dayTrend:daytitle,
  };
  handleTitleArr = (e) => {
      let {value}=e.target;
      if(value===0){
        this.setState({
            titleArr:["平均","当天","前天"],
            dayTrend:daytitle
        })
      }else if(value===1){
        this.setState({
            titleArr:["平均","本周","上周"],
            dayTrend:weektitle
        })
      } else {
          this.setState({
              titleArr:["平均","本月","上月"],
              dayTrend:monthtitle
          })
      }
  }
  render() {
      let {titleArr,dayTrend}=this.state;
    let { className } = this.props;
    return (
      <div className={`perple-entry-trend ${className ? className : ""}`}>
        <div className="chart-top">
          人员出入规律&nbsp;&nbsp;&nbsp;&nbsp;
          <Radio.Group defaultValue={0} onChange={this.handleTitleArr}>
            <Radio value={0}>天</Radio>
            <Radio value={1}>周</Radio>
            <Radio value={2}>月</Radio>
          </Radio.Group>
        </div>
        <PeopleAccessTrend titleArr={titleArr} dayTrend={dayTrend}/>
      </div>
    );
  }
}
