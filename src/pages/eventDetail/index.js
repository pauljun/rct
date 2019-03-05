import React from 'react';
import { Spin, message } from 'antd';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import EventHeader from './component/eventHeader';
import { cloneDeep } from 'lodash';
import './index.less';

const ConfirmComponent = Loader.loadBaseComponent('ConfirmComponent');
const NoData = Loader.loadBaseComponent('NoData');
const PageDetails = Loader.loadBusinessComponent('PageDetails');
const ImageMovieMap = Loader.loadBusinessComponent('ImageMovieMap');
// 魅影告警详情

@withRouter
@Decorator.withEntryLog()
@Decorator.businessProvider('tab', 'user', 'device')
@observer
class EventDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {},
      oldData: undefined,
      handleVisible: false,
      operationDetail: undefined,
      alarmInfoList: [],
      detailList: [], // 外部告警列表
      detailpoint: [],
      libType: '',
      points: [], // 排序点位
      searchData: ''
    };
  }

  componentWillMount() {
    let { history } = this.props;
    const { id } = Utils.queryFormat(history.location.search);
    window.LM_DB.get('parameter', id).then(data => {
      this.setState({
        loading: true,
        libType: data.libType,
        searchData: data.searchData,
        isRealAlarm: data.isRealAlarm
      });
      this.getDetail(id)
        .then(() => {
          this.getAlarmList();
          this.getDetailList(data.searchData, data.libType);
        })
        .catch(() => {
          this.setState({ loading: false });
        });
    });
  }

  //获取数据详情
  getDetail = id => {
    const { libType, isRealAlarm = false } = this.state;
    return Service.alarmResult
      .alarmResults({ id, libType, isRealAlarm })
      .then(res => {
        let data = res.data;
        return Service.face.queryPersons(data.captureId).then(item => {
          let aid = item.data.aid;
          let deviceName = item.data.deviceName;
          let address = item.data.address;
          data = Object.assign({}, data, { aid, deviceName, address });
          this.setState({
            loading: false,
            data,
            operationDetail: undefined
          });
          return data;
        });
      });
  };

  // 获取外部告警列表
  getDetailList = (searchData, libType) => {
    if (searchData.limit === 0) {
      searchData.limit = 200;
    }
    return Service.alarmResult
      .queryAlarmResults(searchData, libType)
      .then(res => {
        this.setState({
          detailList: res.data.list || []
        });
      });
  };
  //获取下方列表
  getAlarmList = () => {
    let { data } = this.state;
    let option = { monitorPersonPictureId: data.infoId };
    Service.alarmResult.queryAlarmResults(option).then(res => {
      if (res.data.list.length > 0) {
        res.data.list = res.data.list.map(v =>
          v.isHandle == 0 || v.isEffective !== 0
            ? (v = Object.assign({}, v, { checked: 1 }))
            : (v = Object.assign({}, v, { checked: 0 }))
        );
      }
      let arr = res.data.list.filter(v => v.checked == 1);
      let points = cloneDeep(arr).reverse();
      this.setState({
        alarmInfoList: res.data.list,
        points
      });
    });
  };

  // 警情备注添加
  handleText = e => {
    if (e.target.value.length > 200) {
      message.info('最大长度不超过200');
      return;
    }
    this.setState({
      operationDetail: e.target.value
    });
  };

  // 二次确认框
  handleOpenModal = type => {
    this.setState({
      type,
      handleVisible: true
    });
  };

  onModalCancel = () => {
    this.setState({
      handleVisible: false
    });
  };

  // 处理有效无效
  handleOk = () => {
    let {
      data,
      operationDetail,
      type,
      detailList,
      libType,
      oldData,
      isRealAlarm
    } = this.state;
    Service.alarmResult
      .handleAlarmResult(
        {
          id: data.id,
          operationDetail: operationDetail,
          isEffective: type
        },
        {
          libType,
          isRealAlarm
        }
      )
      .then(res => {
        this.setState({
          operationDetail: undefined,
          data: res.data,
          handleVisible: false
        });
        return res;
      })
      .then(res => {
        message.info('设置告警状态成功');
        SocketEmitter.emit(SocketEmitter.eventName.resolveAlarm, res.data);
        let nextDetail = undefined;
        if (detailList.length > 0) {
          let chose = {};
          if (oldData) {
            chose = detailList.find(v => v.id == oldData.id);
          } else {
            chose = detailList.find(v => v.id == data.id);
          }
          let number = detailList.indexOf(chose);
          if (number < detailList.length && number > -1) {
            nextDetail = detailList[number + 1];
          }
        }
        if (nextDetail) {
          this.changeDetailView(nextDetail.id);
        } else {
          this.getAlarmList();
        }
      });
  };

  // 翻页
  handleChangeList = id => {
    this.setState(
      {
        oldData: this.state.data
      },
      () => {
        this.getDetail(id).then(() => {
          this.getAlarmList();
        });
      }
    );
  };

  changeDetailView = id => {
    const { tab, location } = this.props;
    const { searchData, isRealAlarm, libType } = this.state;
    window.LM_DB.add('parameter', {
      id: id.toString(),
      libType,
      isRealAlarm: isRealAlarm,
      searchData: searchData
    }).then(() => {
      tab.goPage({
        moduleName: 'eventDetail',
        location,
        data: { id },
        action: 'replace',
        isUpdate: true
      });
    });
    this.getDetail(id).then(item => {
      Service.alarmResult
        .queryAlarmResults({ monitorPersonPictureId: item.infoId })
        .then(res => {
          if (res.data.list.length > 0) {
            res.data.list = res.data.list.map(v =>
              v.isHandle == 0 || v.isEffective !== 0
                ? (v = Object.assign({}, v, { checked: 1 }))
                : (v = Object.assign({}, v, { checked: 0 }))
            );
          }
          let arr = res.data.list.filter(v => v.checked == 1);
          let points = cloneDeep(arr).reverse();
          this.setState({
            oldData: undefined,
            points,
            alarmInfoList: res.data.list,
            operationDetail: undefined
          });
        });
    });
  };

  renderContent() {
    let { data = {}, loading, detailList, operationDetail } = this.state;
    if (loading) {
      return null;
    }
    if (Object.keys(data).length === 0) {
      return <NoData />;
    }
    let dataIndex = detailList.findIndex(v => v.id === data.id),
      preData = undefined,
      nextData = undefined;
    if (dataIndex > 0) {
      preData = detailList[dataIndex - 1];
      nextData = detailList[dataIndex + 1];
    }
    if (dataIndex === 0 && detailList.length > 1) {
      nextData = detailList[dataIndex + 1];
    }

    return (
      <>
        <EventHeader
          data={data}
          handleOpenModal={this.handleOpenModal}
          handleText={this.handleText}
          operationDetail={operationDetail}
        />
        <div className="detail-imm">
          {preData ? (
            <PageDetails
              pageType="pre"
              imgUrl={preData.faceUrl}
              id={preData.id}
              waterType="multiple"
              onChange={this.handleChangeList}
            />
          ) : (
            <div className="null" />
          )}
          <ImageMovieMap type="body" data={data} key={data.id} />
          {nextData ? (
            <PageDetails
              pageType="next"
              imgUrl={nextData.faceUrl}
              id={nextData.id}
              onChange={this.handleChangeList}
            />
          ) : (
            <div className="null" />
          )}
        </div>
      </>
    );
  }

  render() {
    let { handleVisible, type, loading } = this.state;
    return (
      <div className="event-detail">
        <Spin spinning={loading}>{this.renderContent()}</Spin>
        <ConfirmComponent
          title={type == 1 ? '有效提醒确认' : '无效提醒确认'}
          visible={handleVisible}
          onCancel={this.onModalCancel}
          onOk={this.handleOk}
          width={320}
          icon={type == 1 ? 'icon-YesNo_Yes_Main' : 'icon-YesNo_No_Main'}>
          <div>点击“确定”将其标注为{type == 1 ? '有' : '无'}效提醒？</div>
        </ConfirmComponent>
      </div>
    );
  }
}

export default EventDetail;
