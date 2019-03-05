import React from 'react';
import './index.less';
import { withRouter } from 'react-router-dom';
import {Spin,Button,Tabs,Icon } from 'antd';
const { TabPane } = Tabs;
const NoData = Loader.loadBaseComponent('NoData');
const ObjectMapPersonnelCard = Loader.loadBusinessComponent('Card','ObjectMapPersonnelCard');
const InfiniteScrollLayout = Loader.loadBaseComponent('InfiniteScrollLayout');
const tabOption = [{key: '1', value: '最常出现人员'},{key: '2', value: '临时出现人员'},{key: '3', value: '长期未出现人员'},]
@Decorator.businessProvider('tab')
@withRouter
class personnelCompositionAnalysis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey:'1',
      total:0,
      limit: 100,
      offset: 0,
      infinitKey: Math.random(),
      dataList:[],
      loading:false,
    };
    this.infinitRef = React.createRef();
  }
  componentWillMount() {
    this.getPersonnelList()
  }
  getPersonnelList = () => {
    let { location } = this.props;
    let {activeKey,limit,offset,dataList}= this.state
    let pid = Utils.queryFormat(location.search).id;
    if (!pid){
      return
    }
    this.setState({
      loading: true,
    })
    Promise.all([
      Service.place.countTypeByPid({
        placeIds: [pid],
        inAndOutType: activeKey
      }),
      Service.place.getTypeByPid({
        placeIds: [pid],
        limit,
        offset,
        inAndOutType: activeKey
      })
    ]).then(resultArr => {
      let aids=[]
      let newData = resultArr[1].data
      newData.map(v => {
        aids.push(v.aid)
      })
      Service.person.queryAidsPicture({
        aids: aids
      }).then(res => {
        newData.map( (v,k) => {
          v.lastestPictureUrl = res.data[k].lastestPictureUrl
          v.newestPictureUrl = res.data[k].newestPictureUrl
          return v
        })
        this.setState({
          loading: false,
          total: resultArr[0].data,
          dataList: dataList.concat(newData),
          offset: offset + limit
        })
      })
    })
  }
  refresh = () => {
    console.log('刷新')
    this.handleTableKey(this.state.activeKey)
  }
  handleTableKey = key => {
    this.setState({
      activeKey: key,
      offset: 0,
      dataList:[],
    },() => {
      this.getPersonnelList()
    });
  };
  loadMore = () => {
    this.getPersonnelList()
  }

  jumpDetail = option => {
    const { tab, location } = this.props;
    let moduleName,
      id = undefined;
      if (option.isPerson) {
      id = option.personId;
      moduleName = 'objectMapPersonnelDetailPloy';
    }else{
      id = option.aid;
      moduleName = 'objectMapPersonnelDetailAid';
    }
    tab.goPage({
      moduleName,
      location,
      data: {
        id
      }
    });
  }
  /**设置关注 */
  onFollow = (data, event) => {
    event.stopPropagation();
    let { dataList } = this.state;
    let option = {
      personId: data.personId,
      aid: data.aid,
      isFocus: !data.isFocus
    };
    Service.person.setOrCancelFocus(option).then(res => {
      const findIndex = dataList.findIndex(v => ( v.personId && v.personId === data.personId ) || ( v.aid && v.aid === data.aid));
      if(findIndex > -1) {
        dataList[findIndex].isFocus = !dataList[findIndex].isFocus;
      }
      this.setState({
        dataList,
      }, () => {
        this.infinitRef.current.forceUpdateGrid();
      })
    });
  };
  /**设置关联 */
  onRelation = (data, event) => {
    event.stopPropagation();
    // this.setState({
    //   similarVisible: true,
    //   relationData: data
    // });
  };
  render() {
    let {activeKey,total,dataList,infinitKey,loading } = this.state
    return (
      <div className="personnel-composition-analysis-view">
        < div className = 'personnel-composition-analysis-nav' >
          <div className="personnel-composition-analysis-title">
            <div className="panel-name">人员组成分析</div>
          </div>
          < div className = "personnel-composition-analysis-header" >
            <div className='tab-box'>
              <Tabs
                onChange={this.handleTableKey}
                activeKey={activeKey}
              >
                {
                  tabOption.map(v => {
                    return <TabPane tab={v.value} key={v.key}></TabPane>
                  })
                }
              </Tabs>
            </div>
            < div className = 'personnel-composition-analysis-header-right'>
              < div className = 'personnel-total ' >
                {`${tabOption.find(v => {return v.key===activeKey}).value}总数：`}<p className='personnel-total-num'>{total}</p>
              </div>
              <Button className="refresh_btn" onClick={this.refresh}>
                <Icon type="reload" /> 刷新
              </Button>
            </div>
          </div>
        </div>
        < Spin spinning = {
          loading
        }
        wrapperClassName = 'personnel-composition-analysis-content' >
          {
            dataList.length===0?
            < NoData/>
            : <div className="personnel-center" >
              <InfiniteScrollLayout
                count={total}
                itemWidth={368}
                itemHeight={264}
                pdWidth={60}
                data={dataList}
                hasBackTop={true}
                ref={this.infinitRef}
                key={infinitKey}
                loadMore={this.loadMore}
                renderItem={(item, index) => (
                  <ObjectMapPersonnelCard
                    data={item}
                    imgUrl={item.lastestPictureUrl}
                    personId={item.personId}
                    aid={item.aid}
                    countTitle={activeKey==='3'&&'距离上次出现'}
                    onClick={this.jumpDetail}
                    onFollow={this.onFollow}
                    onRelation={this.onRelation}
                    lastTime={item.recentAppearanceTime}
                    lastAddress={item.recentAppearanceAddress}
                    isFocus={item.isFocus}
                    countDay={item.countDay}
                    tags={item.tags||[]}
                  />
                )}
              />
            </div>
          }
        </Spin>
      </div>
    );
  }
}

export default personnelCompositionAnalysis