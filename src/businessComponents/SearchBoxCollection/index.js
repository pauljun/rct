import React from "react";
import { Select, Radio, Popover, Button } from "antd";
import moment from "moment";
import { observer } from "mobx-react";
import { toJS } from "mobx";
import "./index.less";

const RangePicker = Loader.loadBaseComponent("RangePicker");
const Option = Select.Option;
@Decorator.businessProvider("residentPerson", "flowPerson")
@observer
class AlarmHeaderFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateBegin: undefined,
      dateEnd: undefined,
      showDate: false,
      SpopHoverType: false,
      popShow: false,
      minDate: moment(new Date()).valueOf() - 2592000000, //限制30天时间
      id: Math.random()
    };
  }
  // 标签筛选
  handleTagSort = value => {
    const { residentPerson, onTypeChange, activeKey, flowPerson } = this.props;
    if (value == "") {
      residentPerson.editSearchData({ offset: 0, tagCodes: [] }, activeKey);
      flowPerson.editSearchData({ offset: 0, tagCodes: [] }, activeKey);
      onTypeChange();
      return;
    }
    residentPerson.editSearchData({ offset: 0, tagCodes: [value] }, activeKey);
    flowPerson.editSearchData({ offset: 0, tagCodes: [value] }, activeKey);
    onTypeChange();
  };
  /**时间筛选 */
  chooseTime = (activeKey, e) => {
    let { onTypeChange, residentPerson, flowPerson } = this.props;
    let value = e.target.value;
    if (value == 2) {
      residentPerson.editSearchData({ peroidType: -1 }, activeKey);
      flowPerson.editSearchData({ peroidType: -1 }, activeKey);
      this.props.handlePopShow(true);
      return;
    } else {
      this.props.handlePopShow(false);
      this.setState({
        dateBegin: null,
        dateEnd: null
      });
    }
    residentPerson.editSearchData(
      {
        startTime: undefined,
        endTime: undefined,
        offset: 0,
        peroidType: value - 0
      },
      activeKey
    );
    flowPerson.editSearchData(
      {
        startTime: undefined,
        endTime: undefined,
        offset: 1,
        peroidType: value - 0
      },
      activeKey
    );
    onTypeChange();
  };
  timeChange = (type, value) => {
    let { residentPerson, activeKey, flowPerson } = this.props;
    let { dateBegin } = this.state;
    let startTime = dateBegin;
    let endTime = null;
    if (type === "startTime") {
      startTime = value;
      this.setState({ dateBegin: startTime });
    } else {
      endTime = value;
      this.setState({ dateEnd: endTime });
    }
    if (endTime === null) {
      endTime = moment(new Date()).valueOf();
    }
    residentPerson.editSearchData(
      { offset: 0, peroidType: -1, endTime: endTime, startTime: startTime },
      activeKey
    );
    flowPerson.editSearchData(
      { offset: 0, peroidType: -1, endTime: endTime, startTime: startTime },
      activeKey
    );
  };
  popSubmit = () => {
    const { onTypeChange } = this.props;
    onTypeChange();
    this.setState({
      popShow: false
    });
  };
  popCancel = () => {
    this.setState({
      popShow: false
    });
  };
  popChange = () => {
    this.setState({
      popShow: true
    });
  };
  handleTypeChange = value => {
    let { activeKey, residentPerson, onTypeChange, flowPerson } = this.props;
    residentPerson.editSearchData({ sort: [value], offset: 0 }, activeKey);
    flowPerson.editSearchData({ sort: [value], offset: 0 }, activeKey);
    onTypeChange();
  };
  handleFocuSearch = value => {
    let { activeKey, residentPerson, flowPerson, onTypeChange } = this.props;
    residentPerson.editSearchData({ isFocus: value, offset: 0 }, activeKey);
    flowPerson.editSearchData({ isFocus: value, offset: 0 }, activeKey);
    onTypeChange();
  };
  render() {
    let { dateBegin, dateEnd, popShow, minDate, id } = this.state;
    let {
      activeKey,
      popOne,
      popTwo,
      type,
      showSelsect,
      popThree,
      residentPerson,
      flowPerson
    } = this.props;
    let SpopHoverType =
      activeKey == 1 ? popOne : activeKey == 2 ? popTwo : popThree;
    let Tagarr = toJS(
      Dict.map.personnelAttr
        .concat(Dict.map.fatAndThin)
        .concat(Dict.map.gait)
        .concat(Dict.map.height)
        .concat(Dict.map.identity)
        .concat(Dict.map.aidBehavior)
    ).filter(v => !!v);
    let SearchData =
      type == 1
        ? activeKey == 1
          ? toJS(flowPerson.FloatsearchOption)
          : activeKey == 2
          ? toJS(flowPerson.FloatsearchOptionUnappear)
          : toJS(flowPerson.allFloatSearchOption)
        : activeKey == 1
        ? toJS(residentPerson.searchOption)
        : activeKey == 2
        ? toJS(residentPerson.searchOptionUnappear)
        : toJS(residentPerson.allSearchOption);
    return (
      <div className="community-another-alarm_header_filter">
        <Select
          key={id}
          dropdownClassName="header_filter_select_time_downwrap"
          className="header_filter_time_select"
          style={{ width: 148 }}
          value={SearchData.tagCodes[0] ? SearchData.tagCodes[0] : ""}
          onChange={this.handleTagSort}
          defaultValue={""}
        >
          <Option value={""} className="community-option-size">
            全部标签
          </Option>
          {Tagarr.map(v => (
            <Option value={v.value} className="community-option-size">
              {v.label}
            </Option>
          ))}
          <Option value={"0"} className="community-option-size">
            其他
          </Option>
        </Select>
        {!showSelsect && (
          <Select
            key={id + 0.68345473274}
            dropdownClassName="header_filter_select_type_downwrap"
            className="header_filter_type_select"
            style={{ width: 110 }}
            value={SearchData.sort[0]}
            onChange={this.handleTypeChange}
            defaultValue={"count|desc"}
          >
            {type == 1 ? (
              <Option value="count|desc" className="community-option-size">
                按抓拍次数排序
              </Option>
            ) : (
              <Option value="name|desc" className="community-option-size">
                按姓名排序
              </Option>
            )}
            {(activeKey == 1 || type == 1) && (
              <Option
                value="recent_time|desc"
                className="community-option-size"
              >
                按最后抓拍时间排序
              </Option>
            )}
          </Select>
        )}
        <Select
          key={id + 0.6358432}
          dropdownClassName="header_filter_select_type_downwrap"
          className="header_filter_type_select anotherwidth"
          style={{ width: "100px !important" }}
          value={SearchData.isFocus}
          onChange={this.handleFocuSearch}
          defaultValue={-1}
        >
          <Option value={-1} className="community-option-size">
            全部
          </Option>
          <Option value={1} className="community-option-size">
            已关注
          </Option>
          <Option value={0} className="community-option-size">
            未关注
          </Option>
        </Select>
        {!showSelsect && (
          <Radio.Group
            className="header_filter_radio"
            defaultValue={0}
            value={SearchData.peroidType != -1 ? SearchData.peroidType : 2}
            buttonStyle="solid"
            onChange={this.chooseTime.bind(this, activeKey)}
          >
            <Radio value={0}>不限</Radio>
            <Radio value={1}>24小时</Radio>
            <Radio value={3}>3天</Radio>
            <Radio value={7}>一周</Radio>
            {SpopHoverType ? (
              <Popover
                overlayClassName={"radio_poppver"}
                defaultVisible={true}
                content={
                  <div>
                    <RangePicker
                      onChange={this.timeChange}
                      startTime={dateBegin}
                      endTime={dateEnd}
                      minDate={minDate}
                    />
                    <div className="pop_btn">
                      <Button onClick={this.popCancel}>取消</Button>
                      <Button onClick={this.popSubmit} type="primary">
                        确定
                      </Button>
                    </div>
                  </div>
                }
                trigger="hover"
                placement="bottom"
                visible={popShow}
              >
                <span onClick={this.popChange}>
                  <Radio value={2}>自定义</Radio>
                </span>
              </Popover>
            ) : (
              <span onClick={this.popChange}>
                <Radio value={2}>自定义</Radio>
              </span>
            )}
          </Radio.Group>
        )}
      </div>
    );
  }
}

export default AlarmHeaderFilter;
