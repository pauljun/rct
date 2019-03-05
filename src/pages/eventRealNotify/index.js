import React from 'react';
import { Icon, Spin, Popover, BackTop, Button } from 'antd';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Charts from './component/charts';

import './index.less';

const AuthComponent = Loader.loadBusinessComponent('AuthComponent');
const NoData = Loader.loadBaseComponent('NoData');
const IconFont = Loader.loadBaseComponent('IconFont');
const ForeignCard = Loader.loadBusinessComponent('Card', 'ForeignCard');
const RefreshButton = Loader.loadBaseComponent('RefreshButton');

@withRouter
@Decorator.businessProvider('tab')
@observer
class EventRealNotify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortType: '1',
      isCollapse: false,
      GostAlarmList: [],
      show: false,
      Loading: true,
      circleList: { effectiveNum: 0, ineffectiveNum: 0, unHandledNum: 0 },
      chartList: [],
      showSpin: false,
      showLoading: false
    };
    this.initData();
    this.requestData();
  }
  backTopRef = React.createRef();

  initData() {
    SocketEmitter.on(SocketEmitter.eventName.alarm, this.handleAlarmBody);
    SocketEmitter.on(SocketEmitter.eventName.resolveAlarm, this.handleDoneAlarm);
  }

  handleAlarmBody = result => {
    let { GostAlarmList } = this.state;
    if (result.alarmType === '3') {
      this.setState({
        GostAlarmList: [result].concat(GostAlarmList)
      });
    }
  };
  /**监听滤除处理后的警情 */
  handleDoneAlarm = result => {
    const { GostAlarmList } = this.state;
    const index = GostAlarmList.findIndex(v => v.id === result.id);
    if (index > -1) {
      GostAlarmList.splice(index, 1);
      this.setState({
        GostAlarmList
      });
    }
  };

  componentWillUnmount() {
    SocketEmitter.off(SocketEmitter.eventName.alarm, this.handleAlarmBody);
    SocketEmitter.off(SocketEmitter.eventName.resolveAlarm, this.handleDoneAlarm);
  }

  /**跳转详情页面 */
  handleJumPage = id => {
    const {tab, location } = this.props;
    const options = {
      offset: 0,
      limit: 84,
      alarmOperationType: 2,
      sortType: 1,
      logTypes: '3'
    }
    const moduleName = 'eventDetail';
    const data = {
      id: id,
      libType: 3,
      searchData: options,
      isRealAlarm: true
    };
    window.LM_DB.add('parameter', {
      id: data.id.toString(),
      libType:data.libType,
      isRealAlarm: true,
      searchData: options
    })
    tab.goPage({ moduleName, location, data: {id} });
  };

  /**请求列表数据 */
  requestData( ) {
    const options = {
      offset: 0,
      limit: 84,
      alarmOperationType: 2,
      sortType: 1,
      alarmTypes:['3']
    }
    Service.alarmResult.queryAlarmResults(options).then(res => {
      this.setState({
        showLoading: false,
        Loading:false,
        GostAlarmList: res.data.list
      });
    });
  }
  /**刷新 */
  freshen = () => {
    this.setState({
      showSpin: true
    });
    this.requestData(true, 1);
    setTimeout(() => {
      this.setState({
        showSpin: false
      });
    }, 1500);
  };

  handleJumpMore = () => {
    const { location, tab } = this.props;
    const moduleName = 'EventControl';
    tab.goPage({ moduleName, location });
  };
  
  render() {
    const {
      isCollapse,
      GostAlarmList,
      showLoading
    } = this.state;
    return (
      <div className="event-real-notify">
        <div className={`event-real-total ${isCollapse ? 'collapse' : ''}`}>
          <div className="out-scroll-div">
            <Charts />
          </div>
        </div>
        <div className="event-real-container">
          <div className="alarm-top-tab">
            <div className="alarm-top-left" style={{ fontSize: '16px' }}>
              <IconFont type={'icon-People_All_Main'} theme="outlined" />
              <span style={{ paddingLeft: '2px', fontSize: '15px' }}>
                魅影布防
              </span>
            </div>
            <div
              className="alarm-just-button"
            >
              <RefreshButton onClick={this.freshen} loading={showLoading}/>
              {/* <Button onClick={this.freshen.bind(this)} className="refresh_btn">
                <Icon type="reload" /> 刷新
              </Button> */}
            </div>
          </div>
          {<div
              style={{
                position: 'absolute',
                top: '42%',
                left: '50%',
                zIndex: '10'
              }}
            >
              {GostAlarmList.length == 0 &&
                this.state.Loading && <Spin size="large" />}
              {this.state.showSpin && <Spin size="large" />}
            </div>
          }
          <div className="alart_list_item" ref={this.backTopRef}>
            <div className="spin-loading-bottom">
              <Spin spinning={showLoading} />
            </div>
            {GostAlarmList.length > 0 ? (
              <React.Fragment>
                {GostAlarmList.map((v, i) => (
                  <ForeignCard
                    data={v}
                    isActual={true}
                    handleJumPage={this.handleJumPage}
                    key={i}
                  />
                ))}
                <div className="event-real-alarm-just" />
                <div className="event-real-alarm-just" />
                <div className="event-real-alarm-just" />
                <div className="event-real-alarm-just" />
                <div className="event-real-alarm-just" />
                <AuthComponent actionName="PhantomAlarms">
                  <div className="bottom-button-jump">
                    <Button onClick={this.handleJumpMore}>查看更多</Button>
                  </div>
                </AuthComponent>
              </React.Fragment>
            ) : (
              <div style={{ height: '100%', width: '100%' }}>
                {!this.state.Loading && <NoData />}
              </div>
            )}
          </div>
          <Popover
            content={<span style={{ fontSize: '12px' }}>返回顶部</span>}
          >
            <BackTop target={() => this.backTopRef.current} />
          </Popover>
        </div>
      </div>
    );
  }
}
export default EventRealNotify;
