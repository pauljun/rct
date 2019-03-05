import React from 'react';
import { Radio } from 'antd';
import moment from 'moment';
import './index.less';

const RadioGroup = Radio.Group;
const IconFont = Loader.loadBaseComponent('IconFont');
const PersonPathGraph = Loader.loadBusinessComponent(
  'MapComponent',
  'PersonPathGraph'
);

class ActivityRule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 7
    };
    this.trajectory = null;
  }
  componentDidMount() {
    this.props.queryTrackCount(7);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.trackCount !== this.props.trackCount) {
      this.trajectory && this.trajectory.setData(nextProps.trackCount);
    }
  }
  onChange = e => {
    this.setState({
      value: e.target.value
    });
    this.props.queryTrackCount(e.target.value);
  };

  init = trajectory => {
    this.trajectory = trajectory;
    this.trajectory.setData(this.props.trackCount);
  };

  goTrave = () => {
    this.props.goTrave && this.props.goTrave(this.state.value);
  };

  render() {
    let { value } = this.state;
    const { handleRecord, trackCount = [] } = this.props;
    return (
      <div className="activity-rule">
        <div className="rule-header">
          <div className="title">活动规律：</div>
          <div className="flutter">
            <RadioGroup onChange={this.onChange} defaultValue={7}>
              <Radio value={7}>近一周</Radio>
              <Radio value={30}>近一月</Radio>
            </RadioGroup>
            <div
              className="flutter-button"
              onClick={() => handleRecord && handleRecord(1, value)}>
              <IconFont type={'icon-New__Main8'} theme="outlined" /> 抓拍记录
            </div>
          </div>
        </div>
        <div className="rule-content">
          <PersonPathGraph init={this.init} hasInfo={true} />
          {trackCount.length > 0 && (
            <div className="go-trave" onClick={this.goTrave}>
              <IconFont type="icon-Trajectory_Main" theme="outlined" />
              <p className="trave-span">播放轨迹</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ActivityRule;
