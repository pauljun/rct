import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import './charts.less';

const EventMonitorStatisticsChart = Loader.loadBusinessComponent(
  'Statistics',
  'EventMonitorStatisticsChart'
);
const EventMonitorEffectiveChart = Loader.loadBusinessComponent(
  'Statistics',
  'EventMonitorEffectiveChart'
);
const EventMonitorSeventChart = Loader.loadBusinessComponent(
  'Statistics',
  'EventMonitorSeventChart'
);
const IconFont = Loader.loadBaseComponent('IconFont');

class Charts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      circleList: {},
      chartList: []
    };
    this.initData();
    this.getTypeData();
    this.getDataByDay();
  }
  initData() {
    SocketEmitter.on(SocketEmitter.eventName.resolveAlarm, this.handleDataUpdate);
  }
  handleDataUpdate = () => {
    this.getTypeData();
  };
  componentWillUnmount() {
    SocketEmitter.off(SocketEmitter.eventName.resolveAlarm, this.handleDataUpdate);
  }

  /**请求报警统计饼状图数据*/
  getTypeData = () => {
    Service.statistics
      .countAlarmResultsByHandleType({ alarmTypes: ['3'] })
      .then(res => {
        if (Object.keys(res).length == 0) {
          return;
        }
        this.setState({
          circleList: res.data
        });
      });
  };

  /**七日报警数据统计 */
  getDataByDay = () => {
    let option = {
      larmTypes: ['3'],
      statisticsType: 0
    };
    option.startTime = moment(
      moment()
        .subtract( 7, 'd')
        .format('YYYY MM DD')
    ).valueOf();
    option.endTime = moment(moment().format('YYYY MM DD')).valueOf();
    Service.statistics
      .countAlarmResultsTrendByHandleType(option)
      .then(res => {
        let chartList = [0,0,0,0,0,0,0];
        Object.keys(res.data).map((v) => {
          res.data[v].map((item, index) => {
            chartList[index] += parseInt(item.count)
          })
        });
        this.setState({
          chartList
        })
      });
  };

  render() {
    const { chartList, circleList } = this.state;
    return (
      <React.Fragment>
        <div className="event-echarts" style={{ margin: 0 }}>
          事件提醒
        </div>
        <div className="event-echarts-just">
          <div className="alarm_all_total_num">
            <div className="title">
              <IconFont type={'icon-Alarm_Main'} theme="outlined" />
              <span style={{ color: '#333333', paddingLeft: '4px' }}>
                事件提醒总量统计
              </span>
            </div>
            <div className="content">
              <EventMonitorStatisticsChart circleList={circleList} />
            </div>
          </div>
          <div className="alarm_type_total_num">
            <div className="title">
              <IconFont type={'icon-People_Focus_Main'} />
              <span style={{ color: '#333333', paddingLeft: '4px' }}>
                有效事件统计
              </span>
            </div>
            <div className="content">
              <EventMonitorEffectiveChart circleList={circleList} />
            </div>
          </div>
          <div className="alarm_change_total_num">
            <div className="title">
              <IconFont type={'icon-People_Focus_Main'} />
              <span style={{ color: '#333333', paddingLeft: '4px' }}>
                近七日事件统计
              </span>
            </div>
            <div className="content">
              {<EventMonitorSeventChart chartList={chartList} />}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Charts;
