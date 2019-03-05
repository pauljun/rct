import React from "react";
import "./index.less";

const IconFont = Loader.loadBaseComponent("IconFont");
export default class MesRefresh extends React.Component {
  FreShen = () => {
    this.props.FreShen();
  };
  render() {
    const { title, total } = this.props;
    return (
      <div className="community-header-total">
        <div className="total">
          {title}：<span className="number">{total?total:0}</span>
        </div>
        <div className="header-btn" onClick={this.FreShen}>
          <IconFont type={"icon-Right_Main"} theme="outlined" />
          刷新
        </div>
      </div>
    );
  }
}
