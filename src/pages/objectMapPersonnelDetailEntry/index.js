/*
 * @Author: suyi 
 * @Date: 2019-03-01 14:24:21 
 * @Last Modified by: suyi
 * @Last Modified time: 2019-03-04 19:43:22
 */
import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import './index.less';

const Loading = Loader.Loading;
const DetailTitle = Loader.loadBusinessComponent(
  'ObjectMapPersonnelComponent',
  'DetailTitle'
);
const DetailHeader = Loader.loadBusinessComponent(
  'ObjectMapPersonnelComponent',
  'DetailHeader'
);
const DetailLabel = Loader.loadBusinessComponent(
  'ObjectMapPersonnelComponent',
  'DetailLabel'
);
const ActivityRule = Loader.loadBusinessComponent(
  'ObjectMapPersonnelComponent',
  'ActivityRule'
);
const DetailPersonnelRoom = Loader.loadBusinessComponent(
  'ObjectMapPersonnelComponent',
  'DetailPersonnelRoom'
);
const LabelModal = Loader.loadBusinessComponent(
  'ObjectMapPersonnelComponent',
  'LabelModal'
);
const ColleagueModal = Loader.loadBusinessComponent(
  'ObjectMapPersonnelComponent',
  'ColleagueModal'
);
const SimilarModal = Loader.loadBusinessComponent(
  'ObjectMapPersonnelComponent',
  'SimilarModal'
);
@withRouter
@Decorator.withEntryLog()
@Decorator.businessProvider('tab')
@observer
class ObjectMapPersonnelDetailEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      personData: {}, // 个人信息
      labelVisible: false, // 标签弹窗
      collType: 1, // 同行 常去地点modal类型
      collVisible: false, // 同行活动规律弹窗
      labelList: [], // 个人标签
      aidDetail:{},
      frequentList: [], // 抓拍记录
      collList: [], // 同行列表
      roomList: [],
      similarVisible: false, //关联aid弹窗
      trackCount: [],
    };
  }

   componentDidMount() {
    const { history } = this.props;
    const { id } = Utils.queryFormat(history.location.search);
    window.LM_DB.get('parameter', id).then(data => {
      this.init({ personId: data.id, url: data.url }).catch(() => {
        this.setState({ loading: false });
      });
    });
    SocketEmitter.on(SocketEmitter.eventName.reverseUpdatePerson, this.updatePerson);
  }
  componentWillUnmount() {
    SocketEmitter.off(SocketEmitter.eventName.reverseUpdatePerson, this.updatePerson);
  }
  updatePerson = (data) => {
    let { personData } = this.state;
    personData.isFocus = data.isFocus;
    personData.tags = data.tags || [];
    this.setState({
      personData
    })
  }
  
  goTrave = (days) => {
    const { tab, location } = this.props;
    let option = {};
    option.startTime = moment(
      moment()
        .subtract(days, 'days')
        .format('YYYY MM DD'),moment.ISO_8601
    ).valueOf();
    option.endTime = moment().valueOf();
    this.queryTrackCount(option, true).then(res => {
      let list = res.list || [];
      const id = Utils.uuid();
      window.LM_DB.add('parameter', {
        id,
        list,
        type: 'face'
      }).then(() => {
        tab.goPage({
          moduleName: 'resourceTrajectory',
          location,
          data: { id }
        });
      });
    })
  }
  init = data => {
    return this.getPersonById(data).then(personData => {
      let label = {
        personIds: [data.personId]
      };
      let personLabel = Service.person.queryPersonTags(label),
        focusInfos = Service.person.getFocusInfos(label),
        roommates = Service.person.queryPersonRoommates(
          personData.roommatesUrl
        ); // 同屋
      Promise.all([
        Utils.catchPromise(personLabel),
        Utils.catchPromise(focusInfos),
        Utils.catchPromise(roommates),
      ]).then(res => {
        const [labelRes, focusRes, roomRes] = res;
        let { roomList, collList } = this.state;
        let tags = [];
        labelRes && labelRes.data.map(item => (tags = tags.concat(item.tags)));
        let labelList = [...new Set(tags)];
        labelList = labelList.filter(v => !!v === true );
        labelList = labelList.map(v => v = v + '');
        personData.tags = labelList;
        focusRes && focusRes.data.map(v => {
          if (v.personId === personData.personId) {
            personData.isFocus = v.isFocus;
          }
        });
        roomList =roomRes ? roomRes.data : [];
        if(roomList.length > 5) {
          roomList.length = 5;
        }
        this.setState({
          personData,
          roomList,
          collList,
        });
      });
    });
  };

  /**
   * @description 获取人员详情
   */
  getPersonById = option => {
    return Service.person.getPersonById(option).then(res => {
      this.setState({
        personData: res.data,
        loading: false
      });
      return res.data;
    });
  };

  /**
   * @description 设置关注
   */
  onFollow = event => {
    event.stopPropagation();
    let { personData } = this.state;
    let option = {
      personId: personData.personId,
      isFocus: !personData.isFocus
    };
    Service.person.setOrCancelFocus(option).then(() => {
      personData.isFocus = !personData.isFocus;
      SocketEmitter.emit(SocketEmitter.eventName.updatePerson, personData);
      this.setState({
        personData
      });
    });
  };

  /**
   * @description 获取两个人员的详细同行信息
   */
  queryDetailAccompany = data => {
    let { personData } = this.state;
    let option = {
      aid2: data.aid
    };
    return Service.person.queryDetailAccompany(personData.detailAccompanyUrl,option).then(res => {
      let data = res.data|| [];
      if(data.length > 0) {
        this.setState({
          Accompany: {
            title: data.accompanyCaptureInfos[0].aid2,
            list: data.accompanyCaptureInfos,
            count: data.passCidCount
          }
        });
      }
    });
  };
    /**
   * @description 门禁记录  （用于替代抓拍记录）
   */
  queryTrackCount = (days, type = false) => {
    let { personData } = this.state;
    let option = {

      days,
      limit: 100,
      offset: 0
    };
    return Service.person.getPersonAccessRecords(personData.accessRecordsUrl,option).then(res => {
      let list = res.data.list;
      list.map(v => {v.captureTime = v.openTime; v.deviceName = v.address});
      if(type) {
        let Accompany = {
          count: res.data.total,
          title: '-',
          list,
        }
        this.setState({
          aidDetail: Accompany
        });
        return Accompany;
      } else {
        let arr = [];
        list.map(v => {
          let index = arr.findIndex(item => item.deviceId === v.deviceId);
          if(index > -1) {
            arr[index].count++;
          } else {
            arr.push({
              name: v.address,
              position: [v.longitude, v.latitude],
              count: 1,
              list: [],
              ...v
            })
          }
        });
        this.setState({
          trackCount: arr
        });
        return arr;
      }
    });
  };

  changeLabelModal = () => {
    this.setState({
      labelVisible: true
    });
  };

  handleLabelCancel = () => {
    this.setState({
      labelVisible: false
    });
  };

  handleLabelOK = tagCodes => {
    this.handleLabelCancel();
    let { personData } = this.state;
    let ARR_CODES = [
      '118703',
      '118702',
      '119051',
      '119101',
      '119102',
      '119103',
      '119104',
      '119105',
      '119106',
      '119107',
      '119108',
      '119109',
      '119110',
      '119111',
      '119112',
      '119113',
      '119114',
      '119115',
      '119116',
      '119117',
      '119118',
      '119119',
      '119120',
      '119121'
    ];
    let arr = tagCodes.filter(v => ARR_CODES.indexOf(v) === -1);
    let option = {
      personId: personData.personId,
      tagCodes: arr
    };
    personData.tags = tagCodes || [];
    Service.person.addTags(option).then(() => {
      this.setState({
        personData
      })
      SocketEmitter.emit(SocketEmitter.eventName.updatePerson, personData);
    });
  };

  handleCollCancel = () => {
    this.setState({
      collVisible: false
    });
  };

  /** 改变同屋同行modal状态 并请求对应数据 */
  changeCOllModal = (type, data) => {
    this.setState({
      collVisible: true,
      collType: type
    });
    if (type === 2) {
      this.queryDetailAccompany(data);
    }
    if (type === 1) {
      let option = {};
      option.startTime = moment(
        moment()
          .subtract(data, 'days')
          .format('YYYY MM DD'),moment.ISO_8601
      ).valueOf();
      option.endTime = moment().valueOf();
      /** 由于没有抓拍记录  产品确认用门禁记录代替 此处设为获取门禁记录 */
      this.queryTrackCount(option, true);
    }
  };
  /**
   * @description 设置关联
   */
  onRelation = event => {
    event.stopPropagation();
    this.setState({
      similarVisible: true
    });
  };

  handleSimilarOK = aids => {
    const { personData } = this.state;
    if(aids.length === 0) {
      aids = [
        {
          peopleId: personData.personId,
          aid: "",
          aidUrl: "",
          similarity: 0,
          type: 1
        }
      ]
    }
    let option = {
      aidBindParams: aids
    };
    Service.person.addRelationVids(option).then(res => {
      this.setState({
        similarVisible: false
      });
    });
  };
  handleSimilarCancel = () => {
    this.setState({
      similarVisible: false
    });
  };
  render() {
    if (!this.state.personData.personId) {
      return <Loading />;
    }
    const {
      personData,
      roomList,
      collType,
      Accompany,
      aidDetail,
      frequentList,
      collVisible,
      labelVisible,
      similarVisible,
      trackCount = [],
    } = this.state;
    return (
      <div className="object-map-personnel-detail-entry">
        <DetailTitle title={personData.personName}/>
        <div className="detail-ploy-content">
          <div className="ploy-scroll">
            <DetailHeader
              data={personData}
              hasPersonId={true}
              hasAid={false}
              onFollow={this.onFollow}
              onRelation={this.onRelation}
            />
            <DetailLabel
              onClick={this.changeLabelModal}
              labelList={personData.tags || []}
            />
              <ActivityRule
              goTrave={this.goTrave}
              trackCount={trackCount}
              handleRecord={this.changeCOllModal}
              queryTrackCount={this.queryTrackCount}
            />
            {roomList.length> 0 && <DetailPersonnelRoom
              list={roomList}
              data={personData}
              changeCOllModal={this.changeCOllModal}
            />}
          </div>
        </div>
        <LabelModal
           labelList={personData.tags || []}
          visible={labelVisible}
          onOk={this.handleLabelOK}
          onCancel={this.handleLabelCancel}
        />
        {similarVisible && <SimilarModal
          visible={similarVisible}
          onOk={this.handleSimilarOK}
          onCancel={this.handleSimilarCancel}
          data={personData}
        />}
        <ColleagueModal
          data={personData}
          type={collType}
          Accompany={collType ===2 ? Accompany : aidDetail}
          frequentList={frequentList}
          visible={collVisible}
          onOk={this.handleCollOK}
          onCancel={this.handleCollCancel}
        />
      </div>
    );
  }
}

export default ObjectMapPersonnelDetailEntry;
