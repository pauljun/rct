import React from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Spin } from 'antd';
import './index.less';

const Loading = Loader.Loading;
const NoData = Loader.loadBaseComponent('NoData');
const SearchImageInput = Loader.loadBusinessComponent('SearchImageInput');
const ObjectMapPersonnelCard = Loader.loadBusinessComponent(
  'Card',
  'ObjectMapPersonnelCard'
);
const SimilarModal = Loader.loadBusinessComponent(
  'ObjectMapPersonnelComponent',
  'SimilarModal'
);
const InfiniteScrollLayout = Loader.loadBaseComponent('InfiniteScrollLayout');
const RefreshButton = Loader.loadBaseComponent('RefreshButton');

@withRouter
@Decorator.withEntryLog()
@Decorator.businessProvider('device', 'tab')
@observer
class ObjectMapPersonnelList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchData: {
        keywords: [],
        placeIds: [],
        recommends: [],
        pictureUrl: '',
        limit: 100,
        offset: 0
      },
      total: 0,
      loading: true,
      infinitKey: Math.random(),
      list: [],
      count: 0,
      similarVisible: false,
      relationData: {}
    };
    this.infinitRef = React.createRef();
  }

  componentWillMount() {
    this.init();
    SocketEmitter.on(SocketEmitter.eventName.updatePerson, this.updateList);
  }

  componentWillUnmount() {
    SocketEmitter.off(SocketEmitter.eventName.updatePerson, this.updateList);
  }

  init = () => {
    const { history } = this.props;
    let { searchData } = this.state;
    const id = history.location.search.split('?id=')[1];
    window.LM_DB.get('parameter', id).then(data => {
      if (data) {
        searchData = Object.assign({}, searchData, data.searchData);
      }
      this.setState({
        searchData
      });
      this.InputSearch(searchData, true);
      this.getPersonCount();
    });
  };

  updateList = data => {
    let { list } = this.state;
    const INDEX = list.findIndex(
      v => v.personId === data.personId || v.aid === data.aid
    );
    if (INDEX > -1) {
      list[INDEX].isFocus = data.isFocus;
      list[INDEX].tags = data.tags;
      this.setState(
        {
          list
        },
        () => {
          this.infinitRef.current.forceUpdateGrid();
        }
      );
    }
  };

  getList = searchData => {
    this.setState({
      loading: true
    });
    return Service.person.queryPersons(searchData).then(res => {
      let listArray = res.data.list;
      let total = res.data.total;
      let aids = [],
        personIds = [];
      if (listArray.length > 0) {
        listArray.map(item => {
          if (item.personId) {
            personIds.push(item.personId);
          }
          if (item.aid) {
            aids.push(item.aid);
          }
        });
        return {
          listArray,
          total
        }
        // let focusInfos = Service.person.getFocusInfos({ aids, personIds }),
        //   tags = Service.person.queryPersonTags({ aids, personIds });
        // return Promise.all([focusInfos, tags]).then(items => {
        //   items[0].data.map(item => {
        //     let index = listArray.findIndex(v => {
        //       return v.personId === item.personId || v.aid === item.aid;
        //     });
        //     if (index !== -1) {
        //       listArray[index].isFocus = item.isFocus;
        //     }
        //   });
        //   items[1].data.map(item => {
        //     let index = listArray.findIndex(v => {
        //       return v.personId === item.personId || v.aid === item.aid;
        //     });
        //     if (index !== -1) {
        //       if(item.tags) {
        //         listArray[index].tags = item.tags.filter(v => v);
        //       } else {
        //         listArray[index].tags = [];
        //       }
        //     }
        //   });
        //   return {
        //     listArray,
        //     total
        //   };
        // });
      } else {
        return {
          listArray: [],
          total
        };
      }
    });
  };

  refresh = () => {
    let { searchData = {} } = this.state;
    this.InputSearch(searchData);
  };

  InputSearch = (option = {}, first = false) => {
    let { searchData } = this.state;
    const { tab, location } = this.props;
    option.offset = 0;
    option = Object.assign({}, searchData, option);
    if (!first) {
      const id = Utils.uuid();
      window.LM_DB.add('parameter', {
        id,
        searchData: option
      }).then(() => {
        tab.goPage({
          moduleName: 'objectMapPersonnelList',
          location,
          action: 'replace',
          isUpdate: true,
          data: { id }
        });
      });
    }
    this.getList(option).then(res => {
      this.setState({
        loading: false,
        list: res.listArray || [],
        total: res.total || 0,
        searchData: option,
        infinitKey: Math.random()
      });
    }).catch(() => {
      this.setState({loading: false, list: []})
    });
  };

  // 获取人员档案总数
  getPersonCount = () => {
    Service.person.getPersonCount().then(res => {
      this.setState({
        count: res.data
      });
    });
  };

  loadMore = () => {
    let { searchData, total, list } = this.state;
    if (searchData.offset > total - searchData.limit) {
      return;
    }
    searchData.offset += searchData.limit;
    this.getList(searchData).then(res => {
      list = list.concat(res.listArray);
      this.setState({
        loading: false,
        list,
        total: res.total || 0,
        searchData
      });
    }).catch(() => {
      this.setState({
        loading: false,
        list: []
      })
    });
  };

  jumpDetail = option => {
    const { tab, location } = this.props;
    let moduleName;
    let id = undefined;
    if (option.personId && option.hasAid) {
      id = option.personId;
      moduleName = 'objectMapPersonnelDetailPloy';
    }
    if (option.aid) {
      id = option.aid;
      moduleName = 'objectMapPersonnelDetailAid';
    }
    if (!option.aid && !option.hasAid) {
      id = option.personId;
      moduleName = 'objectMapPersonnelDetailEntry';
    }
    window.LM_DB.add('parameter', {
      id,
      url: option.personInfoUrl
    }).then(() => {
      tab.goPage({
        moduleName,
        location,
        data: { id }
      });
    })
  };

  /**设置关注 */
  onFollow = (data, event) => {
    let { list } = this.state;
    event.stopPropagation();
    let option = {
      personId: data.personId,
      aid: data.aid,
      isFocus: !data.isFocus
    };
    Service.person.setOrCancelFocus(option).then(() => {
      const findIndex = list.findIndex(
        v =>
          (v.personId && v.personId === data.personId) ||
          (v.aid && v.aid === data.aid)
      );
      if (findIndex > -1) {
        list[findIndex].isFocus = !list[findIndex].isFocus;
        SocketEmitter.emit(
          SocketEmitter.eventName.reverseUpdatePerson,
          list[findIndex]
        );
      }
      this.setState(
        {
          list
        },
        () => {
          this.infinitRef.current.forceUpdateGrid();
        }
      );
    });
  };

  /**设置关联 */
  onRelation = (data, event) => {
    event.stopPropagation();
    this.setState({
      similarVisible: true,
      relationData: data
    });
  };

  handleSimilarOK = aids => {
    const { relationData } = this.state;
    let option = {
      personId: relationData.personId,
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
    const {
      list,
      total,
      count,
      similarVisible,
      relationData,
      infinitKey,
      searchData,
      loading
    } = this.state;
    return (
      <div className="object-map-personnel-list">
        <div className="object-map-list-header">
          <div className="object-map-info">人员档案搜索</div>
          <div className="object-map-header-total">
            <div className="total">
              人员档案总数：<span className="number">{count}</span>
            </div>
            <RefreshButton className="header-btn" onClick={this.refresh} />
          </div>
        </div>
        <div className="list-content">
          <div className="personnel-header">
            <SearchImageInput
              searchData={searchData}
              search={this.InputSearch}
            />
          </div>
          <div className="personnel-center">
            <Spin spinning={loading}>
            {list.length > 0 ? 
              <InfiniteScrollLayout
                count={total}
                itemWidth={348}
                itemHeight={264}
                pdWidth={80}
                key={infinitKey}
                data={list}
                hasLoadMore={!loading}
                hasBackTop={true}
                ref={this.infinitRef}
                loadMore={this.loadMore}
                renderItem={item => (
                  <ObjectMapPersonnelCard
                    data={item}
                    imgUrl={
                      item.portraitPictureUrl ||
                      (item.aidPictureInfos && item.aidPictureInfos[0].newestPictureUrl)
                    }
                    aid={item.aid}
                    address={item.address}
                    personId={item.personId}
                    personName={item.personName}
                    isFocus={item.isFocus}
                    tags={item.tags}
                    lastAddress={item.recentAppearanceAddress}
                    lastTime={item.recentAppearanceTime}
                    onClick={this.jumpDetail}
                    onFollow={this.onFollow}
                    onRelation={this.onRelation}
                    hasAid={item.hasAid}
                  />
                )}
              /> : <NoData />}
            </Spin>
          </div>
        </div>
        { similarVisible && <SimilarModal
          visible={similarVisible}
          onOk={this.handleSimilarOK}
          onCancel={this.handleSimilarCancel}
          data={relationData}
        /> }
      </div>
    );
  }
}

export default ObjectMapPersonnelList;
