import React from "react";
import { message } from "antd";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import "./index.less";
const MonitorNavigation = Loader.loadBusinessComponent("MonitorNavigation");
const NoData = Loader.loadBaseComponent("NoData");
const Loading = Loader.Loading
const TaskList = Loader.loadBusinessComponent(
  "MonitorHistoryAlarm",
  "TaskList"
);
const AlarmList = Loader.loadBusinessComponent(
  "MonitorHistoryAlarm",
  "AlarmList"
);
const LittlePagtion = Loader.loadBusinessComponent(
  'BaseLibComponents',
  'LittlePagtion'
);
const searchDataInit = {
  startTime: undefined,
  endTime: undefined,
  timeType: undefined,
  alarmOperationType: undefined,
  taskIds: undefined,
  installationSites: undefined,
  noInstallationSites: undefined,
  libIds: [],
  sort: ["captureTime|desc"],
  captureUids: "",
  offset: 0,
  limit: 200
};

@withRouter
@Decorator.withEntryLog()
@Decorator.businessProvider("device", "tab")
@observer
class EventHistoryNotify extends React.Component {
  constructor(props) {
    super(props);
    this.urlParams = Utils.queryFormat(props.location.search);
    this.searchList = Shared.searchList([
      "AlarmTimeTypeSelect",
      "AlarmSiteScreening",
      "AlarmTimeRadio"
    ]);
    this.state = {
      libType: 3,
      loading: true,
      infinitKey: Math.random(),
      searchData: searchDataInit,
      sortType: "1", // 1-按时间排序 2-按相识度排序
      dataList: {
        list: [],
        total: 0
      } // 告警列表数据
    };
    this.backTopRef = React.createRef();
    this.listRef =React.createRef();
  }

  componentWillMount() {
    this.isClick = true;
    this.initUrlOptions();
    SocketEmitter.on(SocketEmitter.eventName.resolveAlarm, this.updateCard);
  }
  
  /**
   * @desc 根据url获取查询条件
   */
  initUrlOptions = () => {
    const options = this.urlParams;
    if (options.id) {
      LM_DB.get("parameter", options.id).then(result => {
        this.setState({ searchData: { ...searchDataInit, ...result.data } });
      });
    }
  };
  //
  mergeSearchData = options => {
    const id = Utils.uuid();
    LM_DB.add("parameter", {
      id,
      data: options
    }).then(() => {
      this.props.tab.goPage({
        moduleName: "eventHistoryNotify",
        location: this.props.location,
        isUpdate: true,
        data: { id },
        action: "replace"
      });
    });
  };

  componentWillUnmount() {
    SocketEmitter.off(SocketEmitter.eventName.resolveAlarm);
  }
  updateCard = data => {
    let { dataList } = this.state;
    let { list } = dataList;
    list.forEach(v => {
      if (v.id == data.id) {
        v.isEffective = data.isEffective;
        v.isHandle = 1;
      }
    });
    this.setState({
      dataList
    });
  };
  // 布控详情跳转
  handlePageJump = (id, libType) => {
    const { tab, location } = this.props;
    const { searchData, dataList } = this.state;
    for(let i in searchData) {
      if(!searchData[i]) {
        delete searchData[i];
      }
    }
    const list = dataList.list;
    const findIndex = list.findIndex(v => v.id === id);
    if(findIndex > -1) {
      const number = Math.floor(findIndex / searchData.limit);
      searchData.offset = number * searchData.limit;
    }
    window.LM_DB.add('parameter', {
      id: id.toString(),
      libType,
      isRealAlarm: false,
      searchData: this.state.searchData
    })
    tab.goPage({ moduleName: "eventDetail", location, data: {id} });
  };

  // 搜索
  search = (loadMore = false) => {
    let { searchData, libType,infinitKey,dataList } = this.state;
    // 新增搜索前判断是否存在id，如果不存在，不搜索
    let taskIds = searchData.taskIds;
    if (!taskIds) {
      return new Promise(resolve => resolve(true));
    }
    this.setState({
      loading: true,
    })
    return Service.alarmResult
      .queryAlarmResults(searchData, libType)
      .then(res => {
        if(loadMore) {
          res.data.list = dataList.list.concat(res.data.list);
        } else {
          infinitKey = Math.random();
        }
        this.setState({
          loading: false,
          dataList: res.data,
          infinitKey
        });
        this.searchOn && this.mergeSearchData(searchData)
        this.searchOn =true
      });
  };

  // 搜索条件选择
  searchDataChange = (options,loadMore) => {
    const { searchData } = this.state;
    let params = Object.assign({}, searchData, options);
    this.setState(
      {
        searchData: params
      },
      () => {
        return this.search(loadMore);
      }
    );
    return new Promise(resolve => resolve(true));
  };

  // 翻页
  onChange = () => {
    this.searchDataChange({ offset:0 });
  };

  //全部筛选方法
  onTypeChange = (value, loadMore = false) => {
    return this.searchDataChange(value, loadMore);
  };

  // 修改store 参数
  setStoreSeacrhData = value => {
    const { searchData } = this.state;
    let params = Object.assign({}, searchData, value);
    this.setState({ searchData: params });
  };

  /**处理警情 */
  handle = (item, isEffective, operationDetail = undefined) => {
    const { libType } = this.state;
    return Service.alarmResult
      .handleAlarmResult(
        {
          id: item.id,
          isEffective,
          operationDetail
        },
        {
          libType
        }
      )
      .then(res => {
        message.info("设置提醒状态成功");
        //更新警情
        let { list, total } = this.state.dataList;
        list.map(v => {
          if (v.id === item.id) {
            v.isHandle = 1;
            v.isEffective = isEffective;
          }
          return v;
        });
        this.setState({
          dataList: {
            list,
            total
          }
        }, () => {
          this.listRef.current.infinitRef.current.forceUpdateGrid();
        });
        // 更新布控告警列表的告警数量
        this.NavViewDom.updataListUnhandledAlarmCount(res);
        return new Promise(resolve => resolve(true));
      });
  };
  /**新增方法 根据获取的布控任务id重新获取数据，刷新列表 获得id后，之前所有的查询条件重置*/
  getTaskId = taskIds => {
    let { searchData } = this.state;
    /** 使用初始搜索条件 */
    let searchDataObj = Object.assign({}, searchData, { taskIds });
    if (!taskIds.length) {
      this.setState({
        loading: false,
        dataList: {
          list: [],
          total: 0
        }
      });
      this.setStoreSeacrhData(searchDataObj);
      return new Promise(resolve => resolve(true));
    }
    return this.searchDataChange(searchDataObj);
  };
  render() {
    const { dataList, modalVisable, loading, searchData, libType,infinitKey } = this.state;
    const { list, total } = dataList;
    let alarmHandlePriv = true;
    return (
      <MonitorNavigation libType={3} currentMenu="eventHistoryNotify">
        <div className="history-alarm-wrapper">
          <div className="alarm-task">
            <TaskList
              isAlarmMthodsgetId={this.getTaskId}
              item={{}}
              isAlarm={true}
              queryType={1}
              taskTypes={["101503"]}
              libType={libType}
            />
          </div>
          <div className="alarm-container">
            <div className="alarm-container-header">
              <div className="left">
              {this.searchList.map(v => (
                  <v.component
                    key={v.type}
                    searchData={searchData}
                    onTypeChange={this.searchDataChange}
                  />
                ))}
              </div>
              <div className="right" />
            </div>
            <LittlePagtion
              searchData={searchData}
              total={total || 0}
              onChange={this.onChange}
              loading={loading}
            />
            <div className="alarm-history-box-out" ref={this.backTopRef}>
                  {!loading ? list && list.length > 0 ? (
                    <div
                      className={`task-list ${
                        list.length > 0 ? "" : "no-data"
                      } ${alarmHandlePriv ? "" : "no-handle"}`}
                    >
                        <AlarmList
                          cardType = 'ForeignCard'
                          total={total || 0}
                          list={list}
                          itemWidth={182}
                          itemHeight={300}
                          pdWidth={220}
                          searchData={searchData}
                          handle={this.handle}
                          loading={loading}
                          libType={libType}
                          infinitKey={infinitKey}
                          ref={this.listRef}
                          onTypeChange={this.onTypeChange}
                          modalVisable={modalVisable}
                          handlePageJump={this.handlePageJump.bind(this)}
                        />
                    </div>
                  ) : (
                    <NoData imgType={2} title={"告警数据"} />
                  ) : <Loading loading={loading} />}
            </div>
          </div>
        </div>
      </MonitorNavigation>
    );
  }
}

export default EventHistoryNotify;
