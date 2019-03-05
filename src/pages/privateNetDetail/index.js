import React from 'react';
import { Spin, message } from 'antd';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import PrivateNetHeader from './component/privateNetHeader';
// 专网套件告警详情

import './index.less';

const NoData = Loader.loadBaseComponent('NoData');
const Loading = Loader.Loading;
const PageDetails = Loader.loadBusinessComponent('PageDetails');
const ImageMovieMap = Loader.loadBusinessComponent('ImageMovieMap');
const HorizontalScrollLayout = Loader.loadBaseComponent(
  'HorizontalScrollLayout'
);
const KeyPonitRollingCard = Loader.loadBusinessComponent(
  'Card',
  'KeyPonitRollingCard'
);

@withRouter
@Decorator.withEntryLog()
@Decorator.businessProvider('tab', 'user', 'device')
@observer
class PrivateNetDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {},
      handleVisible: false,
      operationDetail: undefined,
      oldData: undefined,
      alarmInfoList: [],
      detailList: [], // 外部告警列表
      detailpoint: [],
      libType: '',
      searchData: {},
      isRealAlarm: false // 是否从实时告警跳转（记录日志需要）
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
  getDetail = id => {
    const { isRealAlarm, libType } = this.state;
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
      detailList,
      oldData,
      operationDetail,
      type,
      libType,
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
          data: res.data,
          handleVisible: false,
          operationDetail: undefined
        });
        return res;
      })
      .then(() => {
        message.info('设置告警状态成功');
        SocketEmitter.emit(SocketEmitter.eventName.resolveAlarm);
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
  //获取下方列表
  getAlarmList = () => {
    let { data } = this.state;
    let option = { monitorPersonPictureId: data.infoId };
    Service.alarmResult.queryAlarmResults(option).then(res => {
      this.setState({
        alarmInfoList: res.data.list
      });
    });
  };

  handleChangeList = id => {
    const { tab, location } = this.props;
    const { searchData, isRealAlarm, libType } = this.state;
    window.LM_DB.add('parameter', {
      id: id.toString(),
      libType,
      isRealAlarm: isRealAlarm,
      searchData: searchData
    }).then(() => {
      tab.goPage({
        moduleName: 'privateNetDetail',
        location,
        data: { id },
        action: 'replace',
        isUpdate: true
      });
    });
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
        moduleName: 'privateNetDetail',
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
          this.setState({
            oldData: undefined,
            alarmInfoList: res.data.list
          });
        });
    });
  };

  renderItem = (item, index) => {
    const { data } = this.state;
    return (
      <KeyPonitRollingCard
        data={item}
        isActive={item.id == data.id}
        handleChangeList={this.handleChangeList}
      />
    );
  };

  renderContent() {
    let {
      data,
      libType,
      detailList = [],
      alarmInfoList,
      loading,
      oldData
    } = this.state;
    if (loading) {
      return null;
    }
    if (Object.keys(data).length === 0) {
      return <NoData />;
    }
    let dataIndex = detailList.findIndex(v =>
        oldData ? v.id === oldData.id : v.id === data.id
      ),
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
        <PrivateNetHeader data={data} />
        <div className="detail_imm">
          {preData ? (
            <PageDetails
              pageType="pre"
              waterType="multiple"
              imgUrl={preData.faceUrl}
              id={preData.id}
              onChange={this.changeDetailView}
            />
          ) : (
            <div className="null" />
          )}
          <ImageMovieMap
            data={data}
            libType={libType}
            key={data && data.id}
            maptype={false}
          />
          {nextData ? (
            <PageDetails
              waterType="multiple"
              pageType="next"
              imgUrl={nextData.faceUrl}
              id={nextData.id}
              onChange={this.changeDetailView}
            />
          ) : (
            <div className="null" />
          )}
        </div>
        <HorizontalScrollLayout
          size={6}
          data={alarmInfoList}
          className="private-horizont"
          renderItem={this.renderItem}
        />
      </>
    );
  }
  render() {
    let { loading } = this.state;
    return (
      <div className="private-net-detail">
        <Spin spinning={loading}>{this.renderContent()}</Spin>
      </div>
    );
  }
}

export default PrivateNetDetail;
