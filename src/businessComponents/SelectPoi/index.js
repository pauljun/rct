import React from "react";
import { Select, Spin } from "antd";

import "./index.less";

const Option = Select.Option;

class SelectPoi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adressArr: [],
      fetching: false
    };
    this.timer = null;
  }
  /*地图搜索*/
  onSearch = value => {
    clearTimeout(this.timer);
    if (value.trim().length === 0) {
      return;
    } else {
      // 增加防抖
      this.timer = setTimeout(() => {
        this.setState({ fetching: true });
        Service.place.inputAssistant({ keywords: value }).then(res => {
          if (res.data) {
            this.setState({ adressArr: res.data, fetching: false });
          }
        });
      }, 500);
    }
  };
  /*定位*/
  jumpPoi = value => {
    let { adressArr } = this.state;
    let item = adressArr.find(v => v.name === value);
    let centerPoint = item ? item.location.split(",") : "";
    this.props.map.setZoomAndCenter(18, centerPoint);
    this.props.getCenter && this.props.getCenter(centerPoint, item);
  };
  render() {
    let { adressArr } = this.state;
    return (
      <Select
        className="map-searchs"
        showSearch
        allowClear
        showArrow={false}
        filterOption={false}
        onSearch={this.onSearch}
        onSelect={this.jumpPoi}
        defaultActiveFirstOption={false}
        notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
        placeholder="请输入关键字"
      >
        {adressArr.map(v => (
          <Option key={v.name} value={v.name}>
            {v.name}
          </Option>
        ))}
      </Select>
    );
  }
}
export default SelectPoi;
