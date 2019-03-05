/*
 * @Author: suyi
 * @Date: 2019-03-01 14:24:12
 * @Last Modified by: suyi
 * @Last Modified time: 2019-03-04 19:41:27
 */
import React from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import moment from 'moment';
import './index.less';

const Loading = Loader.Loading;
const DetailFeatures = Loader.loadBusinessComponent(
  'ObjectMapPersonnelComponent',
  'DetailFeatures'
);
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
const DetailPersonnelRoom = Loader.loadBusinessComponent(
  'ObjectMapPersonnelComponent',
  'DetailPersonnelRoom'
);
const LabelModal = Loader.loadBusinessComponent(
  'ObjectMapPersonnelComponent',
  'LabelModal'
);
const ActivityRule = Loader.loadBusinessComponent(
  'ObjectMapPersonnelComponent',
  'ActivityRule'
);
const ColleagueModal = Loader.loadBusinessComponent(
  'ObjectMapPersonnelComponent',
  'ColleagueModal'
);
const TravelRule = Loader.loadBusinessComponent(
  'ObjectMapPersonnelComponent',
  'TravelRule'
);

@withRouter
@Decorator.withEntryLog()
@Decorator.businessProvider('tab')
@observer
class ObjectMapPersonnelDetailAid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      collVisible: false, // 同行活动规律弹窗
      labelVisible: false, // 标签弹窗
      personData: {}, // 个人信息
      collType: 1, // 同行 常去地点modal类型
      Accompany: [], // 详细同行信息
      frequentList: [], // 抓拍记录
      collList: [], // 同行列表
      aidDetail: {},
      travelList: [], // 出行规律
      appearance: [], // 体貌特征
      trackCount: [] // 活动规律
    };
  }

  componentDidMount() {
    const { history } = this.props;
    const { id } = Utils.queryFormat(history.location.search);
    window.LM_DB.get('parameter', id).then(data => {
      this.init({ aid: data.id, url: data.url }).catch(() => {
        this.setState({ loading: false });
      });
    });
    SocketEmitter.on(
      SocketEmitter.eventName.reverseUpdatePerson,
      this.updatePerson
    );
  }

  componentWillUnmount() {
    SocketEmitter.off(
      SocketEmitter.eventName.reverseUpdatePerson,
      this.updatePerson
    );
  }

  updatePerson = data => {
    let { personData } = this.state;
    personData.isFocus = data.isFocus;
    personData.tags = data.tags || [];
    this.setState({
      personData
    });
  };

  goTrave = days => {
    const { tab, location } = this.props;
    let option = {};
    option.startTime = moment(
      moment()
        .subtract(days, 'days')
        .format('YYYY MM DD'),moment.ISO_8601
    ).valueOf();
    option.endTime = moment().valueOf();
    this.queryAidDetail(option).then(res => {
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
    });
  };

  init = data => {
    return this.getPersonById(data).then(personData => {
      let label = {
        aids: [data.aid]
      };
      let personLabel = Service.person.queryPersonTags(label),
        focusInfos = Service.person.getFocusInfos(label),
        first = Service.person.queryFirstAppearance(
          personData.firstAppearanceUrl
        ),
        recent = Service.person.queryRecentAppearance(
          personData.recentAppearanceUrl
        ),
        accompanies = Service.person.queryPersonAccompanies(
          personData.accompaniesUrl
        ),
        detailAppearance = Service.person.getPersonDetailAppearance(
          personData.detailAppearanceUrl
        );
      Promise.all([
         Utils.catchPromise(personLabel),
         Utils.catchPromise(focusInfos),
         Utils.catchPromise(first),
         Utils.catchPromise(recent),
         Utils.catchPromise(accompanies),
         Utils.catchPromise(detailAppearance)
      ]).then(res => {
        let { collList, appearance } = this.state;
        const {labelRes, focusRes, firstRes, recentRes, accRes, detailRes} = res;
        let tags = [];
        labelRes && labelRes.data.map(item => (tags = tags.concat(item.tags)));
        let labelList = [...new Set(tags)];
        labelList = labelList.filter(v => !!v === true);
        labelList = labelList.map(v => (v = v + ''));
        personData.tags = labelList;
        focusRes && focusRes.data.map(v => {
          if (v.aid === personData.aid) {
            personData.isFocus = v.isFocus;
          }
        });
        personData = Object.assign({}, personData, firstRes ? firstRes.data : {},recentRes? recentRes.data: {}, data);
        collList = accRes ? accRes.data.list : [];
        if (collList.length > 5) {
          collList.length = 5;
        }
        appearance = detailRes ? detailRes.data : [];
        this.setState({
          personData,
          collList,
          appearance
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
      aid: personData.aid,
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
   * @description 查询aid轨迹聚合统计接口
   */
  queryTrackCount = days => {
    let { personData } = this.state;
    let option = {
      aids: [personData.aid],
      days
    };

    Service.statistics.queryTrackCount(option).then(res => {
      let data = res.data;
      let arr = [];
      data.map(v => {
        arr.push({
          name: v.deviceName,
          position: [v.longitude, v.latitude],
          count: v.count,
          cid: v.cid,
          list: v.trackList.map(item => {
            return {
              name: item.deviceName,
              position: [item.longitude, item.latitude],
              count: item.count,
              cid: item.cid
            };
          })
        });
      });
      this.setState({
        trackCount: arr
      });
    });
  };

  /**
   * @description 一天出行规律
   */
  queryActivityRuleOneDay = parms => {
    let { personData } = this.state;
    return Service.person.queryTravelRuleInOneDay(personData.travelRuleInOneDayUrl, parms).then(res => {
      let arr = [];
      res.data.map((item, index) => {
        arr[index] = item.rules.map(v => v.count);
      });
      this.setState({
        travelList: arr
      });
    });
  };

  queryTravelRuleByMouth = type => {
    let { personData } = this.state;
    let option = {
      // aid: personData.aid,
      type: 0
    };
    if (type === 7) {
      let dayIndex = moment().format('d');
      if (dayIndex !== 0) {
        option.startTime = moment(
          moment()
            .subtract(parseInt(dayIndex) + 6, 'd')
            .format('YYYY MM DD'),moment.ISO_8601
        ).valueOf();
      } else {
        option.startTime = moment(
          moment()
            .subtract(13, 'd')
            .format('YYYY MM DD'),moment.ISO_8601
        ).valueOf();
      }
    } else {
      option.type = 1;
      let dayIndex = moment().format('D');
      option.startTime = moment(
        moment()
          .subtract(parseInt(dayIndex) + 30, 'd')
          .format('YYYY MM DD'),moment.ISO_8601
      ).valueOf();
    }
    option.endTime = moment(moment().format('YYYY MM DD')).valueOf();
    let day = Service.person.queryTravelRuleByDay(personData.travelRuleByDayUrl,option);
    let average = Service.person.queryAverageTravelRule(personData.averageTravelRuleUrl,option);
    Promise.all([day, average]).then(res => {
      let list = [];
      let arr = res[0].data.map(v => v.count);
      if (type === 7) {
        list[1] = arr.splice(0, 7);
        list[0] = arr;
      } else {
        list[1] = arr.splice(0, 30);
        list[0] = arr;
      }
      list[2] = res[1].data.map(v => v.count);
      this.setState({
        travelList: list
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
      let data = res.data || [];
      if (data.length > 0) {
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

  queryAidDetail = option => {
    let { personData } = this.state;
    option.aids = [personData.aid];
    let getPersonFrequentedPlaces = Service.person.getPersonFrequentedPlaces(personData.frequentedPlacesUrl);
    let queryAidDetail = Service.person.queryAidDetail(option);
    return Promise.all([getPersonFrequentedPlaces, queryAidDetail]).then(
      res => {
        let data = res[0].data.places;
        data.sort((a, b) => a.count - b.count).reverse();
        data[0] = data[0] || {};
        let Accompany = {
          count: data[0].count,
          title: data[0].placeName || data[0].placeId
        };
        Accompany.list = res[1].data.list;
        this.setState({
          aidDetail: Accompany
        });
        return Accompany;
      }
    );
  };

  handleCollOK = () => {
    this.handleCollCancel();
  };

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
          .format('YYYY MM DD')
      ).valueOf();
      option.endTime = moment().valueOf();
      this.queryAidDetail(option);
    }
  };
  handleCollCancel = () => {
    this.setState({
      collVisible: false
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
    let arr = tagCodes.filter(v => ARR_CODES.includes(v));
    let option = {
      aid: personData.aid,
      tagCodes: arr
    };
    personData.tags = tagCodes || [];
    Service.person.addTags(option).then(() => {
      this.setState({
        personData
      });
      SocketEmitter.emit(SocketEmitter.eventName.updatePerson, personData);
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
  render() {
    const {
      collVisible,
      labelVisible,
      personData,
      collType,
      Accompany,
      frequentList,
      aidDetail,
      travelList,
      collList,
      appearance,
      trackCount,
      loading
    } = this.state;
    if (loading) {
      return <Loading />;
    }
    return (
      <div className="object-map-personnel-detail-aid">
        <DetailTitle title={personData.aid} />
        <div className="detail-ploy-content">
          <div className="ploy-scroll">
            <DetailHeader
              data={personData}
              hasPersonId={false}
              hasAid={true}
              onFollow={this.onFollow}
            />
            <DetailLabel
              onClick={this.changeLabelModal}
              labelList={personData.tags || []}
            />
            {appearance.length > 0 && (
              <DetailFeatures appearance={appearance} />
            )}
            <ActivityRule
              goTrave={this.goTrave}
              trackCount={trackCount}
              handleRecord={this.changeCOllModal}
              queryTrackCount={this.queryTrackCount}
            />
            <TravelRule
              travelList={travelList}
              queryTravelRuleByMouth={this.queryTravelRuleByMouth}
              queryActivityRuleOneDay={this.queryActivityRuleOneDay}
            />
            {collList.length > 0 && (
              <DetailPersonnelRoom
                list={collList}
                data={personData}
                changeCOllModal={this.changeCOllModal}
              />
            )}
          </div>
        </div>
        <LabelModal
          labelList={personData.tags || []}
          visible={labelVisible}
          onOk={this.handleLabelOK}
          onCancel={this.handleLabelCancel}
        />
        <ColleagueModal
          data={personData}
          type={collType}
          Accompany={collType === 2 ? Accompany : aidDetail}
          frequentList={frequentList}
          visible={collVisible}
          onOk={this.handleCollOK}
          onCancel={this.handleCollCancel}
        />
      </div>
    );
  }
}

export default ObjectMapPersonnelDetailAid;
