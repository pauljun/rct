import React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Spin, Button, Tabs, Popover } from 'antd';
import AlarmEcharts from './component/AlarmEcharts';
import './index.less';

const TabPane = Tabs.TabPane;
const IconFont = Loader.loadBaseComponent('IconFont');
const NoData = Loader.loadBaseComponent('NoData');
const AuthComponent = Loader.loadBusinessComponent('AuthComponent');
const KeyPointCard = Loader.loadBusinessComponent('Card', 'KeyPointCard');
const ForeignCard = Loader.loadBusinessComponent('Card', 'ForeignCard');
const RefreshButton = Loader.loadBaseComponent('RefreshButton');

@withRouter
@Decorator.businessProvider('tab', 'user')
@observer
class RealAlarmView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortType: '1',
      isCollapse: false,
      activeKey: '1',
      KeyPersonAlarmList: [],
      IlegalPeAlarmList: [],
      SpecPersonAlarmList: [],
      show: false,
      showIl: false,
      showSp: false,
      spinShow: false,
      Loading: true
    };
    this.initData();
    this.requestData();
    this.requestIlData();
    this.requestSpData();
  }
  initData() {
    SocketEmitter.on(SocketEmitter.eventName.alarm, this.handleAlarm);
    SocketEmitter.on(SocketEmitter.eventName.resolveAlarm, this.handleDoneAlarm);
  }
  /**监听推送警情 */
  handleAlarm = result => {
    let {
      KeyPersonAlarmList,
      IlegalPeAlarmList,
      SpecPersonAlarmList
    } = this.state;
    if (result.alarmType === "1") {
      this.setState({
        KeyPersonAlarmList: [result].concat(KeyPersonAlarmList)
      });
      return;
    }
    if (result.alarmType === "2") {
      this.setState({
        IlegalPeAlarmList: [result].concat(IlegalPeAlarmList)
      });
      return;
    }
    if (result.alarmType === "5") {
      this.setState({
        SpecPersonAlarmList: [result].concat(SpecPersonAlarmList)
      });
      return;
    }
  };
  /**监听处理滤除处理后的警情 */
  handleDoneAlarm = result => {
    const {
      KeyPersonAlarmList,
      IlegalPeAlarmList,
      SpecPersonAlarmList
    } = this.state;
    const index = KeyPersonAlarmList.findIndex(v => v.id === result.id);
    const indexa = IlegalPeAlarmList.findIndex(v => v.id === result.id);
    const indexb = SpecPersonAlarmList.findIndex(v => v.id === result.id);
    if (index > -1) {
      KeyPersonAlarmList.splice(index, 1);
      this.setState({
        KeyPersonAlarmList
      });
    } else if (indexa > -1) {
      IlegalPeAlarmList.splice(indexa, 1);
      this.setState({
        IlegalPeAlarmList
      });
    } else {
      SpecPersonAlarmList.splice(indexb, 1);
      this.setState({
        SpecPersonAlarmList
      });
    }
  };
  /**跳转页面*/
  handlePageJump = id => {
    const { tab, location } = this.props;
    const { activeKey } = this.state;
    let searchData = {
      offset: 0,
      limit: 0,
      alarmOperationType: 2,
      sortType: 1
    };
    let moduleName = 'keyPersonnelDetail';
    let data = {
      id: id,
      libType: 1,
      searchData,
      isRealAlarm: true
    };
    if (activeKey === '1') {
      moduleName = 'keyPersonnelDetail';
      data.logTypes = '2';
      data.threshold = '60.0';
      data.libType = 1;
      searchData.alarmTypes = [1];
    }
    if (activeKey === '2') {
      moduleName = 'outsiderDetail';
      data.logTypes = '2';
      data.libType = 2;
      searchData.alarmTypes = [2];
    }
    if (activeKey === '3') {
      moduleName = 'privateNetDetail';
      data.libType = 4;
      data.logTypes = '2';
      searchData.alarmTypes = [5];

    }
    window.LM_DB.add('parameter', {
      id: data.id.toString(),
      libType:data.libType,
      isRealAlarm: true,
      searchData
    }).then(() => {
      tab.goPage({ moduleName, location, data:{id} });
    })
  };
  /**刷新 */
  freshen = () => {
    const { activeKey } = this.state;
    this.setState({
      spinShow: true
    });
    if (activeKey === '1') {
      this.requestData();
    }
    if (activeKey === '2') {
      this.requestIlData();
    }
    if (activeKey === '3') {
      this.requestSpData();
    }
    setTimeout(() => {
      this.setState({
        spinShow: false
      });
    }, 1000);
  };
  componentWillUnmount() {
    SocketEmitter.off(SocketEmitter.eventName.alarm, this.handleAlarm);
    SocketEmitter.off(SocketEmitter.eventName.resolveAlarm, this.handleDoneAlarm);
    window.removeEventListener('scroll', this.eventScroll);
  }
  /**监听滚动高度，超出一定高度显示返回一键返回顶部按钮*/
  componentDidMount() {
    window.addEventListener('scroll', this.eventScroll, true);
  }

  eventScroll = () => {
    let el = this.refs.scrollH;
    let em = this.refs.scrollI;
    let en = this.refs.scrollJ;
    let scrollTop = el ? el.scrollTop : 0;
    let scrollTopIl = em ? em.scrollTop : 0;
    let scrollTopSp = en ? en.scrollTop : 0;
    if (scrollTop > 1000) {
      this.state.show === false &&
        this.setState({
          show: true
        });
    } else {
      this.state.show === true &&
        this.setState({
          show: false
        });
    }
    if (scrollTopIl > 1000) {
      this.state.showIl === false &&
        this.setState({
          showIl: true
        });
    } else {
      this.state.showIl === true &&
        this.setState({
          showIl: false
        });
    }
    if (scrollTopSp > 1000) {
      this.state.showSp === false &&
        this.setState({
          showSp: true
        });
    } else {
      this.state.showSp === true &&
        this.setState({
          showSp: false
        });
    }
  };
  /**返回顶部 */
  backTop = type => {
    let el = this.refs.scrollH;
    let em = this.refs.scrollI;
    let en = this.refs.scrollJ;
    if (type === 0) {
      this.getScroll(el);
      // el.scrollTop = 0;
    } else if (type === 1) {
      this.getScroll(em);
      // em.scrollTop = 0;
    } else {
      this.getScroll(en);
      // en.scrollTop = 0;
    }
  };

  getScroll = ref => {
    const scrollTop = ref.scrollTop;
    const startTime = Date.now();
    const frameFunc = () => {
      const timestamp = Date.now();
      const time = timestamp - startTime;
      ref.scrollTop = this.easeInOutCubic(time, scrollTop, 0, 450);
      if (time < 450) {
        requestAnimationFrame(frameFunc);
      } else {
        ref.scrollTop = 0;
      }
    };
    requestAnimationFrame(frameFunc);
  };

  easeInOutCubic = (t, b, c, d) => {
    const cc = c - b;
    t /= d / 2;
    if (t < 1) {
      return (cc / 2) * t * t * t + b;
    } else {
      return (cc / 2) * ((t -= 2) * t * t + 2) + b;
    }
  };

  /**请求滚动条数据 */
  requestData = () => {
    Service.alarmResult
      .queryAlarmResults({
        offset: 0,
        limit: 80,
        alarmOperationType: 2,
        alarmTypes: [1],
      })
      .then(res => {
        this.setState({
          KeyPersonAlarmList: res.data.list ? res.data.list : []
        });
        setTimeout(() => {
          this.setState({
            Loading: false
          });
        }, 1500);
      });
  };
  requestIlData = () => {
    Service.alarmResult
      .queryAlarmResults({
        offset: 0,
        limit: 84,
        alarmOperationType: 2,
        alarmTypes: [2],
      })
      .then(res => {
        this.setState({
          IlegalPeAlarmList: res.data.list ? res.data.list : []
        });
      });
  };
  requestSpData = () => {
    Service.alarmResult
      .queryAlarmResults({
        offset: 0,
        limit: 84,
        alarmOperationType: 2,
        alarmTypes: [5],
      })
      .then(res => {
        this.setState({
          SpecPersonAlarmList: res.data.list ? res.data.list : []
        });
      });
  };
  handleTableKey = key => {
    this.setState({
      activeKey: key,
      show: false,
      showIl: false,
      showSp: false
    });
  };
  handleButtonClick = type => {
    const { tab, location } = this.props;
    if (type == 1) {
      const moduleName = 'keyPersonnelHistory';
      tab.goPage({ moduleName, location });
      return;
    } else if (type == 2) {
      const moduleName = 'outsiderHistory';
      tab.goPage({ moduleName, location });
      return;
    } else {
      const moduleName = 'privateNetHistory';
      tab.goPage({ moduleName, location });
      return;
    }
  };

  render() {
    const {
      show,
      showIl,
      showSp,
      isCollapse,
      activeKey,
      KeyPersonAlarmList,
      IlegalPeAlarmList,
      SpecPersonAlarmList,
      Loading,
      spinShow
    } = this.state;
    let KeyPersonAlarmListHandle = KeyPersonAlarmList.slice(0, 80);
    let IlegalPeAlarmListHandle = IlegalPeAlarmList.slice(0, 84);
    let SpecPersonAlarmListHandle = SpecPersonAlarmList.slice(0, 84);
    return (
      <div className="person-alarm-view">
        <div className={`person-alarm-left ${isCollapse ? 'collapse' : ''}`}>
          <AlarmEcharts />
        </div>
        <div className="person-alarm-right">
          <div className="alarm-just-button">
            <RefreshButton onClick={this.freshen} loading={spinShow} size={'default'}/>
          </div>
          <div className="ant-popover-get" />
          {KeyPersonAlarmList.length == 0 && Loading && (
            <div className="real-alarm-spin-bufferPosition">
              <Spin size="large" />
            </div>
          )}
          {spinShow && (
            <div className="real-alarm-spin-bufferPosition">
              <Spin size="large" />
            </div>
          )}
          {show && (
            <Popover
              content={<span style={{ fontSize: '12px' }}>返回顶部</span>}
              getPopupContainer={() =>
                document.querySelector('.ant-popover-get')
              }>
              <div
                className="alarm-scroll-height"
                onClick={this.backTop.bind(this, 0)}
              />
            </Popover>
          )}
          {showIl && (
            <Popover
              content={<span style={{ fontSize: '12px' }}>返回顶部</span>}
              getPopupContainer={() =>
                document.querySelector('.ant-popover-get')
              }>
              <div
                className="alarm-scroll-height"
                onClick={this.backTop.bind(this, 1)}
              />
            </Popover>
          )}
          {showSp && (
            <Popover
              content={<span style={{ fontSize: '12px' }}>返回顶部</span>}
              getPopupContainer={() =>
                document.querySelector('.ant-popover-get')
              }>
              <div
                className="alarm-scroll-height"
                onClick={this.backTop.bind(this, 2)}
              />
            </Popover>
          )}
          <Tabs
            type="card"
            onChange={this.handleTableKey}
            activeKey={this.state.activeKey}>
            <TabPane
              tab={
                <span style={{ fontSize: '16px' }}>
                  <IconFont type={'icon-People_Focus_Main'} />
                  <span style={{ fontSize: '14px' }}>重点人员告警</span>
                </span>
              }
              key="1">
              {KeyPersonAlarmListHandle.length > 0 ? (
                <div className="alarm-tabs-tabscreate other" ref="scrollH">
                  {KeyPersonAlarmListHandle.map((v, index) => (
                    <KeyPointCard
                      key={index}
                      isActual={true}
                      data={v}
                      handleJumPage={this.handlePageJump}
                    />
                  ))}
                  <div className="name-real-alarm-none" />
                  <div className="name-real-alarm-none" />
                  <div className="name-real-alarm-none" />
                  <AuthComponent actionName="keyPersonnelHistory">
                    <div className="real-alarm-height">
                      <Button onClick={this.handleButtonClick.bind(this, 1)}>
                        查看更多
                      </Button>
                    </div>
                  </AuthComponent>
                </div>
              ) : (
                !Loading && <NoData />
              )}
            </TabPane>
            <TabPane
              tab={
                <span style={{ fontSize: '16px' }}>
                  <IconFont type={'icon-Temporary_Dark'} />
                  <span style={{ fontSize: '14px' }}>外来人员告警</span>
                </span>
              }
              key="2">
              {IlegalPeAlarmListHandle.length > 0 ? (
                <div className="alarm-tabs-tabscreate" ref="scrollI">
                  {IlegalPeAlarmListHandle.map((v, index) => (
                    <ForeignCard
                      key={index}
                      isActual={true}
                      activeKey={activeKey}
                      data={v}
                      handleJumPage={this.handlePageJump}
                    />
                  ))}
                  <div className="name-real-alarm-none-il" />
                  <div className="name-real-alarm-none-il" />
                  <div className="name-real-alarm-none-il" />
                  <div className="name-real-alarm-none-il" />
                  <div className="name-real-alarm-none-il" />
                  <AuthComponent actionName="outsiderHistory">
                    <div className="real-alarm-height">
                      <Button onClick={this.handleButtonClick.bind(this, 2)}>
                        查看更多
                      </Button>
                    </div>
                  </AuthComponent>
                </div>
              ) : (
                !Loading && <NoData />
              )}
            </TabPane>
            <TabPane
              tab={
                <span style={{ fontSize: '16px' }}>
                  <IconFont
                    type={'icon-People_Machine_Main'}
                    theme="outlined"
                  />
                  <span style={{ fontSize: '14px' }}>专网套件告警</span>
                </span>
              }
              key="3">
              {SpecPersonAlarmListHandle.length > 0 ? (
                <div className="private-netHistory-list alarm-tabs-tabscreate" ref="scrollJ">
                  {SpecPersonAlarmListHandle.map((v, index) => (
                    <ForeignCard
                      key={index}
                      activeKey={activeKey}
                      data={v}
                      isActual={true}
                      handleJumPage={this.handlePageJump}
                    />
                  ))}
                  <div className="name-real-alarm-none-il" />
                  <div className="name-real-alarm-none-il" />
                  <div className="name-real-alarm-none-il" />
                  <div className="name-real-alarm-none-il" />
                  <div className="name-real-alarm-none-il" />
                  <AuthComponent actionName="privateNetHistory">
                    <div className="real-alarm-height">
                      <Button onClick={this.handleButtonClick.bind(this, 3)}>
                        查看更多
                      </Button>
                    </div>
                  </AuthComponent>
                </div>
              ) : (
                !Loading && <NoData />
              )}
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default RealAlarmView;
