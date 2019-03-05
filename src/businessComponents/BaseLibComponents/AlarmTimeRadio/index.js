import React from 'react';
import { Radio, Popover, Button } from 'antd';
import moment from 'moment';

import './index.less';

const RangePicker = Loader.loadBaseComponent('RangePicker');

class AlarmTimeRadio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateBegin: null,
      dateEnd: moment().valueOf(),
      maxDate: false,
      minDate: false,
      showDate: false,
      popHoverType: false,
      option: {},
		};
		this.refTime = React.createRef();
  }

  chooseTime = e => {
    let { onTypeChange } = this.props;
    let value = e.target.value;
    if (value == 'undefined') {
      value = undefined;
    }
    let option = {}, startTime = undefined, endTime = undefined;
    if (value != 2) {
      if (value === undefined) {
        endTime = moment().valueOf();
        this.setState({
          showDate: false,
          dateBegin: undefined,
          dateEnd: moment().valueOf()
        });
      } else {
        startTime = moment()
        .subtract(value || 0, 'days')
        .valueOf();
        endTime = moment().valueOf();
        this.setState({
          showDate: false,
          dateBegin: moment()
            .subtract(value || 0, 'days')
            .valueOf(),
          dateEnd: moment().valueOf()
        });
      }
      option.offset = 0;
      option.startTime = startTime;
      option.endTime = endTime;
      option.timeType = value;
      onTypeChange(option);
      this.setState({
        popHoverType: false
      });
    } else {
      onTypeChange({ timeType: 2 });
      this.setState({
        popHoverType: true
      });
    }
  };

  timeChange = (type, value) => {
    let { searchData } = this.props;
    let { dateBegin } = this.state;
    let startTime = dateBegin,
      endTime = undefined,
      maxDate = undefined,
      minDate = undefined;
    if (type === 'startTime') {
      startTime = value;
      maxDate = value + 2592000000;
      this.setState({ dateBegin: startTime, maxDate });
    } else {
      endTime = value;
      minDate = value - 2592000000;
      this.setState({ dateEnd: endTime, minDate });
    }
    if (type === 'startTime' && endTime === undefined) {
      endTime = moment(new Date()).valueOf();
    }
    let option = searchData;
    option.endTime = endTime;
    option.startTime = startTime;
    this.setState({
      option
    });
  };

  popSubmit = () => {
    let { searchData } = this.props;
    let { dateBegin, dateEnd } = this.state;
    let option = searchData;
    option.endTime = dateEnd;
    option.startTime = dateBegin;
    this.props.onTypeChange(option);
    this.setState({
      popHoverType: false
    });
  };

  popCancel = () => {
    this.setState({
      popHoverType: false
    });
  };

  popClick = (e) => {
		Utils.stopPropagation(e);
    let { searchData } = this.props;
    if(searchData.timeType === 2) {
      this.setState({
        popHoverType: !this.state.popHoverType
      })
    }
  }

  render() {
    let {
      dateBegin,
      dateEnd,
      popHoverType,
    } = this.state;
    let { searchData, libType } = this.props;
    return (
      <div className="alarm-time-radio">
        <div className="time-piack-layout" ref={this.refTime}/>
        <Radio.Group
          className="header_filter_radio"
          defaultValue={'undefined'}
          value={searchData.timeType === undefined ? 'undefined' : searchData.timeType}
          buttonStyle="solid"
          onChange={this.chooseTime}
        >
          <Radio value={'undefined'}>不限</Radio>
          <Radio value={1}>24小时</Radio>
          <Radio value={3}>3天</Radio>
          <Radio value={7}>7天</Radio>
          <Popover
            overlayClassName={'radio_poppver'}
						getPopupContainer={() => this.refTime.current }
            content={
              <div>
                <RangePicker
                  onChange={this.timeChange}
                  startTime={dateBegin}
                  endTime={dateEnd}
                  maxDate={libType !==3 ? false : true}
                  minDate={libType !==3 ? false : -30}
                  allowClear={false}
                />
                <div className="pop_btn">
                  <Button onClick={this.popCancel}>取消</Button>
                  <Button onClick={this.popSubmit} type="primary">
                    确定
                  </Button>
                </div>
              </div>
            }
            placement="bottom"
            visible={popHoverType}
          >
            <span >
              <Radio onClick={this.popClick} value={2}>自定义</Radio>
            </span>
          </Popover>
        </Radio.Group>
      </div>
    );
  }
}

export default AlarmTimeRadio;