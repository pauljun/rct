import React from 'react';
import { Spin, message } from 'antd';
import { observer } from 'mobx-react';
import { cloneDeep } from 'lodash';
import { withRouter } from 'react-router-dom';
import OutsiderHeader from './component/outsiderHeader';
import './index.less';

const Loading = Loader.loadBaseComponent('Loading');
const NoData = Loader.loadBaseComponent('NoData');
const ConfirmComponent = Loader.loadBaseComponent('ConfirmComponent');
const ImageMovieMap = Loader.loadBusinessComponent('ImageMovieMap');
const PageDetails = Loader.loadBusinessComponent('PageDetails');

// 非法入侵告警详情

@withRouter
@Decorator.withEntryLog()
@Decorator.businessProvider('user', 'tab', 'device')
@observer
class OutsiderDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {},
      oldData: undefined,
      handleVisible: false,
      operationDetail: undefined,
      libList: [],
      detailList: [], // 外部告警列表
      detailpoint: [],
      libType: '',
      searchData: {},
      alarmInfoList: [],
      points: [], // 排序点位
      checkShow: false, // 控制底部列表单选按钮显示隐藏
      isRealAlarm: false
    };
    /*
		libType
		详情类型
			重点人员布控历史告警详情  1
			非法入侵告警详情         2
			魅影告警								3
			专网套件告警详情         4
	*/
  }
  componentWillMount() {
    let { history } = this.props;
    const personId = history.location.search.split('?id=')[1];
    window.LM_DB.get('parameter', personId).then(data => {
      this.setState({
        loading: true,
        detailList:data.list,
        libType: data.libType,
        searchData: data.searchData,
        isRealAlarm: data.isRealAlarm
      });
      this.getDetail(personId)
        .then(() => {
          this.getAlarmList();
        })
        .catch(() => {
          this.setState({ loading: false });
        });
    });
  }
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

  getDetail = id => {
    const { libType, isRealAlarm } = this.state;
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

  // 跳转到人员库管理 若没有管理权限不给予跳转
  goLibDetail = item => {
    let { tab, location, user } = this.props;
    Service.monitor.getLibDetail(item).then(res => {
      let managers = res.managers;
      let userInfo = user.userInfo;
      if (managers.find(v => v.userId === userInfo.id)) {
        const state = { libId: item };
        let option = { moduleName: 'outsiderLibraryView', location, state };
        tab.goPage(option);
      } else {
        return;
      }
    });
  };
  
  onOperationDetailSaveClick = isEffective => {
    let { data, operationDetail, libType, isRealAlarm } = this.state;
    return Service.monitor
      .updateItem(
        {
          id: data.id,
          operationDetail: operationDetail,
          isEffective
        },
        {
          libType,
          isRealAlarm
        }
      )
      .then(res => {
        this.setState({
          data: res.data,
          operationDetail: undefined
        });
        return new Promise(resolve => resolve(true));
      });
  };

  handleText = e => {
    if (e.target.value.length > 200) {
      message.info('最大长度不超过200');
      return;
    }
    this.setState({
      operationDetail: e.target.value
    });
  };

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

  handleOk = () => {
    let {
      data,
      operationDetail,
      type,
      detailList,
      libType,
      isRealAlarm,
      oldData
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
          data: res.data,
          handleVisible: false,
          operationDetail: undefined
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
        moduleName: 'outsiderDetail',
        location,
        data: { id },
        action: 'replace',
        isUpdate: true
      });
    });
    this.getDetail(id).then(data => {
      Service.alarmResult
        .queryAlarmResults({ monitorPersonPictureId: data.infoId })
        .then(res => {
          if (res.data.list.length > 0) {
            res.data.list = res.data.list.map(v =>
              v.isHandle == 0 || v.isEffective !== 0
                ? (v = Object.assign({}, v, { checked: 1 }))
                : (v = Object.assign({}, v, { checked: 0 }))
            );
          }
          this.setState({
            alarmInfoList: res.alarmInfoList,
            operationDetail: undefined
          });
        });
    });
  };
  renderContent() {
    let {
      data = {},
      libList,
      loading,
      detailList = [],
      operationDetail
    } = this.state;
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
        <OutsiderHeader
          data={data}
          libList={libList}
          handleText={this.handleText}
          handleOpenModal={this.handleOpenModal}
          operationDetail={operationDetail}
          goLibDetail={this.goLibDetail}
        />
        <div className="detail_imm">
          {preData ? (
            <PageDetails
              pageType="pre"
              imgUrl={preData.faceUrl}
              id={preData.id}
              onChange={this.changeDetailView}
            />
          ) : (
            <div className="null" />
          )}
          <ImageMovieMap data={data} key={data.id} maptype={false} />
          {nextData ? (
            <PageDetails
              pageType="next"
              imgUrl={nextData.faceUrl}
              id={nextData.id}
              onChange={this.changeDetailView}
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
      <div className="outsider-detail">
        <Spin spinning={loading}>{this.renderContent()}</Spin>

        <ConfirmComponent
          title={type == 1 ? '有效告警确认' : '无效告警确认'}
          visible={handleVisible}
          onCancel={this.onModalCancel}
          onOk={this.handleOk}
          width={320}
          icon={type == 1 ? 'icon-YesNo_Yes_Main' : 'icon-YesNo_No_Main'}
          children={
            <div>点击“确定”将其标注为{type == 1 ? '有' : '无'}效告警？</div>
          }
        />
      </div>
    );
  }
}

export default OutsiderDetail;
