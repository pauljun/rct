import React from "react";
import "./communityBelonging.less";
const IconFont = Loader.loadBaseComponent("IconFont");
export default class CommuntiyBelongingStatistic extends React.Component {
  render() {
    const { villageCount, houseCount, deviceCount } = this.props.baseMes;
    return (
      <div className="community-belonging">
        <p>
          <IconFont type={"icon-Dataicon__Dark4"} theme="outlined" />
          <span className="community-count">小区数量</span>
          <span className="count-number">{villageCount}</span>
        </p>
        <p>
          <IconFont type={"icon-New__Main1"} theme="outlined" />
          <span className="community-count">房屋数量</span>
          <span className="count-number">{houseCount}</span>
        </p>
        <p>
          <IconFont type={"icon-_Camera__Main1"} theme="outlined" />
          <span className="community-count">设备数量</span>
          <span className="count-number">{deviceCount}</span>
        </p>
      </div>
    );
  }
}
