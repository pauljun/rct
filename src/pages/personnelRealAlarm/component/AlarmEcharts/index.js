import React from 'react';
import PropTypes from 'prop-types';
import './index.less';

const AlarmNumEchart = Loader.loadBusinessComponent('Statistics', 'AlarmNumEchart');
const AlarmStateEchart = Loader.loadBusinessComponent('Statistics', 'AlarmStateEchart');
const AlarmTypeEchart = Loader.loadBusinessComponent('Statistics', 'AlarmTypeEchart');

class AlarmEcharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      circleList: {},
      typeList: {
        keyPointCount: 0,
        outsiderCount: 0,
        privateNetCount: 0
      }
    };
    this.initData();
    this.getTypeData();
    this.countAlarmResultsByMonitorType();
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
  getTypeData = () => {
  
  };

  countAlarmResultsByMonitorType = () => {
    Service.statistics.countAlarmResultsByMonitorType({ alarmTypes: ['1', '2', '5'] }).then(res => {
      let typeList = {};
      res.data.map(v => {
        if(v.alarmType === '1') {
          typeList.keyPointCount = v.count - 0
        }
        if(v.alarmType === '2') {
          typeList.outsiderCount = v.count - 0
        }
        if(v.alarmType === '5') {
          typeList.privateNetCount = v.count - 0
        }
      })
      this.setState({
        typeList
      })
    });
  }



  render() {
    const { typeList, circleList} = this.state;
    return (
      <React.Fragment>
        <div className="alarm-echarts" style={{ margin: 0 }}>
          实时告警
        </div>
        <div className="alarm-real-just">
          <div className="alarm_all_total_num">
            <div className="title" />
            <div className="content">
              <AlarmNumEchart circleList={circleList} />
            </div>
          </div>
          <div className="alarm_type_total_num">
            <div className="title" />
            <div className="content">
              <AlarmTypeEchart typeList={typeList} />
            </div>
          </div>
          <div className="alarm_change_total_num">
            <div className="title" />
            <div className="content">
              {<AlarmStateEchart />}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AlarmEcharts;
