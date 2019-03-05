import React, { Component } from "react";
import { observer } from "mobx-react";

import "./index.less";

const ItemComponent = Loader.loadBusinessComponent(
  "Statistics",
  "ItemComponent"
);

@Decorator.errorBoundary
@observer
class Alarms extends Component {
  state = {
    resourcesStatis: {}
  };

  componentDidMount() {
    Service.statistics
      .countAlarmResultsByHandleType({
        alarmTypes: ["1", "2", "4", "5"]
      })
      .then(res => {
        this.setState({ resourcesStatis: res.data || {} });
      });
  }
  render() {
    let { resourcesStatis } = this.state;
    return (
      <div className="chart table">
        <div className="alarms-item-wrapper">
          <ItemComponent
            label="警情总数"
            icon="icon-_Alarm"
            value={Utils.splitNum(
              isNaN(
                resourcesStatis.effectiveCount * 1 +
                  resourcesStatis.ineffectiveCount * 1 +
                  resourcesStatis.unHandledCount * 1
              )
                ? 0
                : resourcesStatis.effectiveCount * 1 +
                    resourcesStatis.ineffectiveCount * 1 +
                    resourcesStatis.unHandledCount * 1
            )}
          />
          <ItemComponent
            label="有效警情数"
            icon="icon-YesNo_Yes_Main"
            value={Utils.splitNum(resourcesStatis.effectiveCount)}
          />
          <ItemComponent
            label="无效警情数"
            icon="icon-YesNo_No_Main"
            value={Utils.splitNum(resourcesStatis.ineffectiveCount)}
          />
          <ItemComponent
            label="未处理警情数"
            icon="icon-Data___Dark2"
            value={Utils.splitNum(resourcesStatis.unHandledCount)}
          />
        </div>
      </div>
    );
  }
}
export default Alarms;
