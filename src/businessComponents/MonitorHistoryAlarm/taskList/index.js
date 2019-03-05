import React from 'react';
import { Popover, List, Checkbox, Spin, message } from 'antd';
import { observer } from 'mobx-react';

import './index.less';

const NoData = Loader.loadBaseComponent('NoData');
const SearchInput = Loader.loadBaseComponent('SearchInput');
const IconFont = Loader.loadBaseComponent('IconFont');
const ConfirmComponent = Loader.loadBaseComponent('ConfirmComponent');
const TaskButtonGroup = Loader.loadBusinessComponent(
  'MonitorHistoryAlarm',
  'TaskButtonGroup'
);
const Loading = Loader.Loading;
// const taskTypesArr = [["101501"], ["101502"], ["101503"], ["101504"]];

@observer
class TaskList extends React.Component {
  state = {
    queryType: 1, // 2-布控任务列表 告警列表类型: 1-全部任务（默认）  2-布控任务列表（自己创建） 3-指派任务 4-本地任务
    loading: false,
    val: '', //搜索框值,
    name: '', //当前搜索条件（布控任务)
    alarmIds: [], //选中的告警列表id
    indeterminate: false, //半选转态
    checkAll: false, //全选状态
    // taskTypes: ["101501"], //101501-黑名单 101502-未知人员布控 101503-魅影
    buttonIsClick: true,
    choseLibId: undefined,
    list: [], // 布控任务列表,
    isShowStopModel: false // 布控告警开启关闭弹框
  };

  componentWillMount() {
    const { queryType ,taskTypes} = this.props;
    //queryType 告警列表类型 1-全部任务（默认）  2-本地任务  3-指派任务
    this.setState({
      queryType,
      taskTypes
    });
    Service.monitorTask
      .queryMonitorTasks({
        taskTypes,
        queryType,
        limit: 500
      })
      .then(res => {
        if(res.code === 200000){
          let list = res.data && res.data.list
          this.setState({
            list
          });
          if (list) {
            this.getAlarmHistoryId(list, true);
          }
        }
      });
  }

  //初始化列表时，对列表进行处理，提取告警列表id，是否同步到父组件（isToFather,默认不同步）
  getAlarmHistoryId = (data = [], isToFather) => {
    let alarmIds = [];
    data.forEach(item => {
      alarmIds.push(item.id);
    });
    //布控告警所有id-全局设置
    this.alarmAllIds = alarmIds;
    //初始全部选中
    this.setState({
      alarmIds,
      checkAll: true
    });
    // 数据传递到父组件
    if (isToFather) {
      // let id = alarmIds.length > 0 ? alarmIds.join(',') : '';
      this.props.isAlarmMthodsgetId &&
        this.props.isAlarmMthodsgetId(alarmIds).then(res => {
          if (res) {
            this.setState({
              buttonIsClick: false
            });
          }
        });
    }
  };

  /**根据条件查询任务列表 */
  getTaskList = (option = {}, callback) => {
    this.setState({ loading: true });
    let { queryType, name } = this.state;
    let {taskTypes} =this.props
    let data = Object.assign({}, { taskTypes, queryType, name, limit: 500 }, option);
    Service.monitorTask.queryMonitorTasks(data).then(res => {
      if(res.code === 200000){
        let list = res.data && res.data.list
        this.setState(
          {
            loading: false,
            list
          },
          () => {
            callback && callback(res.data);
          }
        );
      }
    });
  };

  //判断布控任务状态
  taskTypeStr = (item, isClass) => {
    let res = ''
    switch(item.taskStatus){
      case 0 :
        res = isClass ? 'state be-paused' : '已暂停'
        break;
      case 1 :
        res = isClass ? 'state be-running' : '运行中'
        break;
      case 2 :
        res = isClass ? 'state out-of-date' : '未开始'
        break;
      case 3 :
        res = isClass ? 'state out-of-date' : '已过期'
        break;
      default: 
        break;
    }
    return res
  };
  //切换布控库类型
  tasksFromWhere = queryType => {
    this.setState(
      {
        queryType,
        buttonIsClick: true,
        val: ''
      },
      () => {
        this.searhGroup('');
      }
    );
  };
  /*设置忽略/取消忽略他人授权的布控任务报警 */
  setWhetherIgnoreAlarm = (e, data) => {
    Utils.stopPropagation(e);
    let options = {
      taskId: data.id,
      ignore: data.ignoreStatus === 0 ? 1 : 0
    };
    this.options = options;
    this.ignoreStatus = data.ignoreStatus === 0 ? 1 : 0;
    this.setState({
      isShowStopModel: true
    });
  };
  // 设置忽略/取消忽略他人授权的布控任务报警 --- 二次确认取消
  handleCancelIgnoreStatus = () => {
    this.setState(
      {
        isShowStopModel: false
      },
      () => {
        this.options = {};
      }
    );
  };
  // 设置忽略/取消忽略他人授权的布控任务报警 --- 二次确认确认修改
  handleOkIgnoreStatus = () => {
    Service.monitorTask.setWhetherIgnoreAlarm(this.options).then(res => {
      if (res.code === 200000) {
        message.success('设置成功')
        this.setState(
          {
            isShowStopModel: false
          },
          () => {
            this.getTaskList();
          }
        );
      }
    });
  };

  changeVal = value => {
    this.setState({
      val: value
    });
    this.getTaskList({ name: value }, res => {
      if (res) {
        this.getAlarmHistoryId(res.list, true);
      }
    });
  };
  onCancel = () => {
    this.setState({
      val: ''
    });
    this.getTaskList({ name: '' }, res => {
      if (res) {
        this.getAlarmHistoryId(res.list, true);
      }
    });
  };

  /**布控名称搜索 */
  searhGroup = name => {
    this.setState({ name });
    this.getTaskList({ name: '' }, res => {
      if (res) {
        this.getAlarmHistoryId(res.list, true);
      }
    });
  };
  //复选框
  onAlarmIdChange = val => {
    this.setState({
      alarmIds: val,
      indeterminate: !!val.length && val.length < this.alarmAllIds.length,
      checkAll: val.length === this.alarmAllIds.length
    });
    // let id = val.length > 0 ? val.join(',') : '';
    this.props.isAlarmMthodsgetId && this.props.isAlarmMthodsgetId(val);
  };
  //全选
  alarmCheckAll = e => {
    // let isCheckAll = e.target.checked
    this.setState({
      alarmIds: e.target.checked ? this.alarmAllIds : [],
      indeterminate: false,
      checkAll: e.target.checked
    });
    if (e.target.checked) {
      // let id = this.alarmAllIds.length > 0 ? this.alarmAllIds.join(',') : '';
      this.props.isAlarmMthodsgetId && this.props.isAlarmMthodsgetId(this.alarmAllIds);
    } else {
      //不传id的情况
      this.props.isAlarmMthodsgetId && this.props.isAlarmMthodsgetId([]);
    }
  };
  changeAlarmTask = id => {
    let data = [];
    data.push(id);
    let checkAll = false;
    if (this.alarmAllIds.length == 1) {
      checkAll = true;
    }
    this.setState({
      alarmIds: data,
      checkAll
    });
    this.props.isAlarmMthodsgetId && this.props.isAlarmMthodsgetId([id]);
  };
  thousand(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  }
  render() {
    const {
      loading,
      hasMore,
      buttonIsClick,
      list = [],
      isShowStopModel,
      queryType
    } = this.state;
    //取到所有的布控告警id
    let alarmIds = [];
    list.forEach(item => {
      alarmIds.push(item.id);
    });
    //布控告警所有id
    this.alarmAllIds = alarmIds;
    return (
      <div className="alarm-list">
        <div className="search-group">
          <SearchInput
            size={'default'}
            placeholder={'请输入任务名称搜索'}
            onChange={this.changeVal}
            style={{ width: '100%' }}
          />
        </div>
        <TaskButtonGroup
          disabled={buttonIsClick}
          listType={queryType}
          onClick={this.tasksFromWhere}
        />
        <div className="list-total">
          <span className="list-total-text">我的任务列表：</span>
          {list.length > 0 ? (
            <div className="list-total-checkbox">
              <span className="checkbox-span">全部显示</span>
              <Popover
                overlayClassName={'checkbox-span-pop'}
                placement="bottom"
                content={
                  <div className="checkbox-span-pop-div">
                    请选择下面列表查看单个任务告警
                  </div>
                }>
                <Checkbox
                  onChange={this.alarmCheckAll}
                  checked={this.state.checkAll}
                />
              </Popover>
            </div>
          ) : (
            <div />
          )}
        </div>
        <Checkbox.Group
          onChange={this.onAlarmIdChange}
          value={this.state.alarmIds}>
          <div
            className='list alarm-list'>
            {loading ? (
              <Loading />
            ) : (
              <List
                locale={{ emptyText: <NoData title="告警" imgType={1} /> }}
                dataSource={list}
                renderItem={(v, k) => (
                  <List.Item key={v.id}>
                    <div
                      className={`item ${this.state.alarmIds.length > 0 &&
                        this.state.alarmIds.filter(item => item == v.id)
                          .length == 1 &&
                        'active'} ${this.state.checkAll ? 'check-all' : ''}`}
                      onClick={this.changeAlarmTask.bind(this, v.id)}>
                      <p className="title-name" title={v.name}>
                        {v.name}
                      </p>
                      <div className="item-content">
                        <div className="item-teype">
                          <span className={this.taskTypeStr(v, true)} />
                          <span>{this.taskTypeStr(v, false)}</span>
                        </div>
                        <div className="item-num">
                          <span className="num">
                            {v.unhandledAlarmCount &&
                              this.thousand(+v.unhandledAlarmCount)}
                          </span>
                          <div className="num-box">
                            <span
                              className="icon-span"
                              title={`${
                                v.ignoreStatus === 0 ? '关闭' : '开启'
                              }实时提醒`}
                              onClick={e => this.setWhetherIgnoreAlarm(e, v)}>
                              {v.ignoreStatus === 0 ? (
                                <IconFont type={'icon-AlarmOpen_Main4'} />
                              ) : (
                                <IconFont type={'icon-AlarmClose_Main2'} />
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}>
                {loading && hasMore && (
                  <div className="demo-loading-container">
                    <Spin />
                  </div>
                )}
              </List>
            )}
          </div>
        </Checkbox.Group>
        <ConfirmComponent
          title={`${this.ignoreStatus === 0 ? '开启' : '关闭'}实时提醒确认`}
          visible={isShowStopModel}
          onCancel={this.handleCancelIgnoreStatus}
          onOk={this.handleOkIgnoreStatus}
          className="ignore-status-model"
          width={320}
          icon={
            this.ignoreStatus === 1
              ? 'icon-AlarmClose_Main'
              : 'icon-AlarmOpen_Main'
          }
          children={
            <div className="box-model">
              点击“确认”{`${this.ignoreStatus === 0 ? '开启' : '关闭'}`}
              该任务的实时提醒
            </div>
          }
        />
      </div>
    );
  }
}

export default TaskList;
