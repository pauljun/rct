import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Button } from 'antd';
import moment from 'moment';
import './index.less';
const Wrapper = Loader.loadBusinessComponent('BaseLibComponents', 'Wrapper');
const NoData = Loader.loadBaseComponent('NoData');
const List = Loader.loadBusinessComponent('BaseLibComponents', 'List');
const ObjectMapPersonnelCard = Loader.loadModuleComponent(
  'Card',
  'ObjectMapPersonnelCard'
);
const RefreshButton = Loader.loadBaseComponent('RefreshButton');

@withRouter
@Decorator.businessProvider('tab')
@observer
class SnapshotRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      data: {},
    };
  }

  async componentDidMount() {
    const { history } = this.props;
    const id = history.location.search.split('?id=')[1];
    await window.LM_DB.get('parameter', id).then(res => {
      let data = res.data;
      this.refresh(data);
    });
  }
  refresh = data => {
    if(data.hasAid) {
      this.queryPersonDetail(data);
      return;
    }
    if(data.personId) {
      this.queryPersonRoom(data);
      return;
    }
    if(data.aid) {
      this.queryAidDetail(data);
    }
  };

  queryAidDetail = (parms) => {
    let option = {
      aids: [parms.aid],
      startTime: moment(
        moment()
          .subtract(7, 'days')
          .format('YYYY MM DD')
      ).valueOf(),
    endTime: moment().valueOf()
    };
    let personLabel = Service.person.queryPersonTags({aids: [parms.aid]}),
    queryTrackCount = Service.person.queryAidDetail(option);
    Promise.all([personLabel, queryTrackCount]).then(res => {
      let tags = [];
      res[0].data.map(item => (tags = tags.concat(item.tags)));
      let labelList = [...new Set(tags)];
      labelList = labelList.filter(v => !!v === true);
      labelList = labelList.map(v => (v = v + ''));
      parms.tags = labelList;
      let list = res[1].data.list || [];
      this.setState({
        dataList: {list: list || [], total: list.length},
        data: parms
      })
    })
  }

  queryPersonRoom = parms => {
    let option = {
      days: 30,
      limit: 100,
      offset: 0,
      personId: parms.personId
    };
    let label = {
      personIds: [parms.personId],
    };
    let personLabel = Service.person.queryPersonTags(label),
    getPersonAccessRecords = Service.person.getPersonAccessRecords(option);
    Promise.all([personLabel, getPersonAccessRecords ]).then(res => {
      let tags = [];
      res[0].data.map(item => (tags = tags.concat(item.tags)));
      let labelList = [...new Set(tags)];
      labelList = labelList.filter(v => !!v === true);
      labelList = labelList.map(v => (v = v + ''));
      parms.tags = labelList;
      let list = res[1].data.list;
      list.map(v => {
        v.faceUrl = v.videoUrl;
        v.captureTime = v.openTime;
        v.deviceName = v.address;
      })
      this.setState({
        dataList: {list: res[1].data.list || [], total: res[1].data.total},
        data: parms
      })
    })
  }

  queryPersonDetail = parms => {
    let option = {
      aids: parms.bindAids,
      startTime: moment(
        moment()
          .subtract(30, 'days')
          .format('YYYY MM DD')
      ).valueOf(),
      endTime: moment().valueOf()
    };
    let label = {
      personIds: [parms.personId],
      aids: parms.bindAids
    };
    let getPersonFrequentedPlaces = Service.person.getPersonFrequentedPlaces({
      personId: parms.personId
    }),personLabel = Service.person.queryPersonTags(label),
    queryAidDetail = Service.person.queryAidDetail(option);
    return Promise.all([getPersonFrequentedPlaces, queryAidDetail, personLabel]).then(
      res => {
        let data = res[0].data.places;
        data.sort((a, b) => a.count - b.count).reverse();
        data[0] = data[0] || {};
        let dataList = {
          count: data[0].count,
          title: data[0].placeName || data[0].placeId
        };
        dataList.list = res[1].data.list;
        let tags = [];
        res[2].data.map(item => (tags = tags.concat(item.tags)));
        let labelList = [...new Set(tags)];
        labelList = labelList.filter(v => !!v === true);
        labelList = labelList.map(v => (v = v + ''));
        parms.tags = labelList || [];
        this.setState({
          dataList,
          data: parms
        });
      }
    );
  };

  /**设置关注 */
  onFollow = (data, event) => {
    event.stopPropagation();
    let option = {
      personId: data.id,
      aid: data.aid,
      isFocus: !data.isFocus
    };
    Service.objectPerson.setOrCancelFocus(option).then(res => {
    });
  };

  /**设置关联 */
  onRelation = (data, event) => {
    event.stopPropagation();
    Service.objectPerson.addRelationVids().then(res => {
    });
  };

  render() {
    let { data, dataList } = this.state;
    const { list = [] } = dataList;
    if(!data.personId) {
      return <NoData />
    }
    return (
      <Wrapper
        title="抓拍记录"
        wrapperLeftWidth="348px"
        className="snapshot-record-container">
        <div className="personnel-list">
          <ObjectMapPersonnelCard
            data={data}
            imgUrl={
              data.portraitPictureUrl ||
              (data.aidPictureInfos && data.aidPictureInfos[0].newestPictureUrl)
            }
            aid={data.aid}
            address={data.address}
            personId={data.personId}
            personName={data.personName}
            isFocus={data.isFocus}
            tags={data.tags}
            lastAddress={data.recentAppearanceAddress}
            lastTime={data.recentAppearanceTime}
          />
        </div>
        <React.Fragment>
          <div className="baselib-list-wrapper snapshot-wrapper">
            {list.length ? (
              list.map(v => (
                <div className="box-item">
                  <List
                    data={v}
                    type="face"
                    personMap={true}
                    detailModuleName="faceLibraryDetail"
                    hasDetail={false}
                  />
                </div>
              ))
            ) : (
              <NoData />
            )}
          </div>
        </React.Fragment>
        <div className="header-little-pagtion">
          <div className="header-info">
            共显示<span> {list.length} </span>条数据
          </div>
          <RefreshButton className="header-button" onClick={() => this.refresh(data)}/>
        </div>
      </Wrapper>
    );
  }
}

export default SnapshotRecord;
