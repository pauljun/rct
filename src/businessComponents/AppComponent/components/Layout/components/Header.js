import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Avatar, Popover } from 'antd';
import { observer, inject } from 'mobx-react';
import UserAction from './UserAction';
import UserDefault from 'src/assets/img/base/user-default.svg';
import AboutSystem from './AboutSystem';

const AuthComponent = Loader.loadBusinessComponent('AuthComponent');
const IconFont = Loader.loadBaseComponent('IconFont');

@withRouter
@inject('user', 'menu')
@observer
class RootHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      versionList: {},
      broadcastSrc: ''
    };
    this.init();
  }
  init() {
    // Promise.all([
    //   Service.other.getVersion(),
    //   Service.other.getBroadcastInfo()
    // ]).then(res => {
    //   this.setState({
    //     broadcastSrc: res[1].broadcast,
    //     versionList: res[0]
    //   });
    // });
  }
  render() {
    let { user, showMediaLibrary, menu } = this.props;
    let { versionList = {}, broadcastSrc } = this.state;
    let { userAvatarUrl, realName, userType } = user.userInfo;
    const isAlarm = menu.getInfoByName('personnelRealAlarm');
    return (
      <React.Fragment>
        {userType !== 100701 && (
          <div className="user-item system-view" onClick={() => showMediaLibrary()}>
            <IconFont type="icon-View_Main" theme="outlined" />
            <span className="about-text media-library-btn">我的视图</span>
          </div>
        )}
        <AuthComponent actionName="BroadcastTool">
          <div className="user-item broadcast-item">
            <IconFont type="icon-Broadcast_Dark" theme="outlined" />
            <a href={broadcastSrc.path}>{broadcastSrc.name}</a>
          </div>
        </AuthComponent>
        <Popover getPopupContainer={() => document.getElementById('insert-container')} placement="bottom" overlayClassName={'version_card'} content={<AboutSystem versionList={versionList.about} />}>
          <div className="user-item system-about" onClick={() => window.open('/resource/about.html')}>
            <IconFont type="icon-About_Main" theme="outlined" />
            <span className="about-text">关于</span>
          </div>
        </Popover>
        <Popover placement="bottomRight" content={<UserAction userInfo={user.userInfo} />} getPopupContainer={() => document.getElementById('insert-container')}>
          <div className="user-item user-info">
            <Avatar size={36} icon="user" src={userAvatarUrl ? userAvatarUrl : UserDefault} />
            <span className="user-name" title={realName}>
              {realName}
            </span>
            <IconFont type="icon-Arrow_Small_Down_Mai" theme="outlined" />
          </div>
        </Popover>
        {isAlarm && <AlarmNumIcon />}
      </React.Fragment>
    );
  }
}

@inject('user', 'menu', 'tab')
class AlarmNumIcon extends React.Component {
  state = {
    alarmNum: 0,
    alarmSound: false
  };
  componentDidMount() {
    SocketEmitter.on(SocketEmitter.eventName.alarmNum, this.notifyAlarmNum);
    SocketEmitter.on(SocketEmitter.eventName.alarm, this.handleAlarm);
    Service.statistics.countAlarmResultsByHandleType({ alarmTypes: ['1', '2', '4'] }).then(res => {
      this.setState({ alarmNum: res.data.unHandledCount });
    });
  }
  componentWillUnmount() {
    SocketEmitter.off(SocketEmitter.eventName.alarmNum, this.notifyAlarmNum);
    SocketEmitter.off(SocketEmitter.eventName.alarm, this.handleAlarm);
  }
  handleAlarm = () => {
    debugger
    this.setState(
      {
        alarmSound: true
      },
      () =>
        setTimeout(() => {
          this.setState({
            alarmSound: false
          });
        }, 2000)
    );
  };
  notifyAlarmNum = data => {
    const { user } = this.props;
    if (user.userInfo.id == data.userId) {
      this.setState({ alarmNum: data.unHandleNum });
    }
  };
  jumpAlarm = () => {
    const { tab } = this.props;
    tab.goPage({
      moduleName: 'personnelRealAlarm',
      location: window.ReactHistory.location
    });
  };
  render() {
    const { alarmNum, alarmSound } = this.state;
    return (
      <div className="user-item system-alarm" onClick={this.jumpAlarm}>
        {alarmSound && <audio src="/resource/alarm.mp3" autoplay/>}
        <IconFont type="icon-AlarmOpen_Main1" theme="outlined" />
        <span className="about-text" title={alarmNum}>
          {alarmNum > 999 ? `999+` : alarmNum}
        </span>
      </div>
    );
  }
}

export default RootHeader;
