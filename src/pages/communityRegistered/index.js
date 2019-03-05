import React, { Component } from "react";
import { Tabs } from "antd";
import RightTabPart from "./components/RightTabPart/index";
import { withRouter } from "react-router-dom";
import { observer } from "mobx-react";
import "./index.less";
import MesRefresh from "./components/MesRefresh/index";
const TabPane = Tabs.TabPane;

const VillageResourceList = Loader.loadBusinessComponent("VillageResourceList");

@Decorator.withEntryLog() //日志
@withRouter
@Decorator.businessProvider("residentPerson",'tab')
@observer
class ResidentPerson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectIf: true,
      activeKey: "1",
      longLoading: true,
      specLoading: true,
      allLoading: true,
      LongLiveList: [],
      RegisUnappList: [],
      allList: [],
      total: 0,
      UnAppearTotal: 0,
      allTotal: 0,
      choseId: undefined,
      popOne: false,
      popTwo: false,
      id: Math.random(),
      longId: Math.random(),
      outId: Math.random(),
      allId: Math.random(),
    };
    this.options = {
      page: 0
    };
    this.unoptions = {
      page: 0
    };
    this.allOptions = {
      page: 0
    }; //根据页码计算出请求数据的起始位置
    this.initData();
  }
  initData() {
    SocketEmitter.on(SocketEmitter.eventName.updatePerson, this.ProcessHandle);
  }
  ProcessHandle = () => {
    let { activeKey } = this.state;
    const { residentPerson } = this.props;
    residentPerson.editSearchData({ offset: 0 }, activeKey);
    if (activeKey == 1) {
      this.requestData(true);
    }
    if (activeKey == 2) {
      this.requestUnappear(true);
    }
    if (activeKey == 3) {
      this.requestAllPerson(true);
    }
     setTimeout(() => {
      this.backTop();
    }, 500);
  };
  componentWillUnmount() {
    SocketEmitter.off(SocketEmitter.eventName.updatePerson, this.ProcessHandle);
  }
  /**请求人口列表数据 */
  requestData = (show, loadmore,refreshKey) => {
    const { residentPerson } = this.props;
    const { LongLiveList } = this.state;
    if (!show) {
      residentPerson.initSearchData(1);
    }
    if (loadmore) {
      this.unoptions.page++;
      residentPerson.editSearchData({ offset: this.unoptions.page * 36 }, 1);
    } else {
      this.setState({
        longLoading: true
      });
    }
    Service.community
      .queryRegisteredPeople(residentPerson.searchOption)
      .then(res => {
        this.setState({
          LongLiveList: loadmore
            ? LongLiveList.concat(res.list)
            : res.list,
          total: res.total,
          longLoading: false
        },() => {
          if(refreshKey){
            this.recoverInitPage()
          }
        });
      });
  };
  /**
   * @param {boolean} loadmore 是否为滚动加载
   */
  requestUnappear = (show, loadmore,refreshKey) => {
    const { residentPerson } = this.props;
    const { RegisUnappList } = this.state;
    if (!show) {
      residentPerson.initSearchData(2);
    }
    if (loadmore) {
      this.options.page++;
      residentPerson.editSearchData({ offset: this.options.page * 36 }, 2);
    } else {
      this.setState({
        specLoading: true
      });
    }
    Service.community
      .queryRegisteredPeople(residentPerson.searchOptionUnappear)
      .then(res => {
        this.setState({
          RegisUnappList: loadmore ? RegisUnappList.concat(res.list) : res.list,
          UnAppearTotal: res.total,
          specLoading: false
        },() => {
          if(refreshKey){
            this.recoverInitPage()
          }
        });
      });
  };
  requestAllPerson = (show, loadmore,refreshKey) => {
    const { residentPerson } = this.props;
    const { allList } = this.state;
    if (!show) {
      residentPerson.initSearchData(3);
    }
    if (loadmore) {
      this.allOptions.page++;
      residentPerson.editSearchData({ offset: this.allOptions.page * 36 }, 3);
    } else {
      this.setState({
        allLoading: true
      });
    }
    Service.community
      .queryRegisteredPeople(residentPerson.allSearchOption)
      .then(res => {
        this.setState({
          allList: loadmore ? allList.concat(res.list) : res.list,
          allTotal: res.total,
          allLoading: false
        },() => {
          if(refreshKey){
            this.recoverInitPage()
          }
        });
      });
  };
  FreShen = () => {
    this.requestData(true);
    this.requestUnappear(true);
    this.requestAllPerson(true);
  };
  HandleNoVillageData = () => {
    this.setState({
      LongLiveList: [],
      RegisUnappList: [],
      allList: []
    });
  };
  handleTableKey = key => {
    if (key) {
      this.setState({
        activeKey: key,
        popOne: false,
        popTwo: false
      });
    } else {
      this.setState({
        popOne: false,
        popTwo: false
      });
    }
  };
  /**社区总览跳转小区处理 */
  componentDidMount() {
    const { residentPerson } = this.props;
    residentPerson.initImgandVal();
    residentPerson.initSearchData(1);
    residentPerson.initSearchData(2);
    residentPerson.initSearchData(3);
    const id = this.props.location.search.substring(4, 40);
    if (id.length > 0&&id.length<15) {
      residentPerson.editSearchData({ villageIds: [id] }, 1);
      residentPerson.editSearchData({ villageIds: [id] }, 2);
      residentPerson.editSearchData({ villageIds: [id] }, 3);
      this.setState({
        choseId: id,
        selectIf: false,
      });
      this.requestData(true);
      this.requestUnappear(true);
      this.requestAllPerson(true);
    } else if(id.length>15) {
      LM_DB.get('parameter',this.props.location.search.substring(4, 80)).then(res => {
        let activeKey=res.activeKey;
        let villageIds=res.communitySearchdata&&res.communitySearchdata.villageIds.length==1?
        res.communitySearchdata.villageIds[0]:undefined;
        if(villageIds){
          residentPerson.editSearchData({villageIds:[villageIds]},1);
          residentPerson.editSearchData({villageIds:[villageIds]},2);
          residentPerson.editSearchData({villageIds:[villageIds]},3);
        }
       residentPerson.editSearchData(res.communitySearchdata,activeKey);
        /* if(villageIds){
          residentPerson.editSearchData({villageIds:[villageIds]},1);
          residentPerson.editSearchData({villageIds:[villageIds]},2);
          residentPerson.editSearchData({villageIds:[villageIds]},3);
        }
       residentPerson.editSearchData(res.communitySearchdata,1);
       residentPerson.editSearchData(res.unexistSearchData,2);
       residentPerson.editSearchData(res.allSearchData,3); */
       this.setState({
        activeKey,
        choseId:villageIds,
        selectIf:villageIds?false:true
       })
       this.requestData(true);
       this.requestUnappear(true);
       this.requestAllPerson(true);
      });
    } else {
      this.requestData();
      this.requestUnappear();
      this.requestAllPerson();
    }
  }
  handleSelctId = () => {
   // this.backTop();
    this.setState({
      id: Math.random(),
      value: ""
    });
    this.props.residentPerson.deleteImgAndVal(1, 1);
    this.props.residentPerson.deleteImgAndVal(2, 1);
    this.props.residentPerson.deleteImgAndVal(3, 1);
    this.recoverInitPage();
  };
  backTop = () => {
    let { activeKey } = this.state;
    if (activeKey == 1) {
      this.setState({
        longId: Math.random()
      });
    }
    if (activeKey == 2) {
      this.setState({
        outId: Math.random()
      });
    }
    if (activeKey == 3) {
      this.setState({
        allId: Math.random()
      });
    }
  };
  /**处理日期选择框是否显示的问题 */
  handlePopShow = type => {
    let { activeKey } = this.state;
    if (activeKey == 1) {
      if (type) {
        this.setState({
          popOne: true
        });
      } else {
        this.setState({
          popOne: false
        });
      }
    } else {
      if (type) {
        this.setState({
          popTwo: true
        });
      } else {
        this.setState({
          popTwo: false
        });
      }
    }
  };
  //初始化请求数据开始位置
  recoverInitPage = () => {
    this.options.page = 0;
    this.unoptions.page = 0;
    this.allOptions.page = 0;
    this.backTop();
  };
  updateUrl = (id) => {
    this.props.tab.goPage({
      moduleName: 'communityRegistered',
      location: this.props.location,
      isUpdate: true,
      data: {id},
      action:'replace'
    })
  }
  render() {
    const {
      selectIf,
      activeKey,
      LongLiveList,
      total,
      id,
      choseId,
      RegisUnappList,
      UnAppearTotal,
      popOne,
      popTwo,
      allTotal,
    } = this.state;
    return (
      <div className="community_long_lived_alarm_box">
        <div className="community_left_total">
          <VillageResourceList
            updateUrl={this.updateUrl}
            handleSelctId={this.handleSelctId}
            type="registered"
            HandleNoVillageData={this.HandleNoVillageData}
            requestData={this.requestData}
            requestUnappear={this.requestUnappear}
            requestAllPerson={this.requestAllPerson}
            choseId={choseId}
            activeKey={activeKey}
            queryVillageResoure={this.queryVillageResoure}
            selectIf={selectIf}
          />
        </div>
        <div className="community_right_container">
          <MesRefresh
            title="已登记人员"
            FreShen={this.FreShen}
            total={
              activeKey == 1 ? total : activeKey == 2 ? UnAppearTotal : allTotal
            }
          />
          <Tabs type="card" onChange={this.handleTableKey} activeKey={activeKey}>
            <TabPane tab="常住居民" key="1">
              {<RightTabPart
                recoverInitPage={this.recoverInitPage}
                LongLiveList={LongLiveList}
                longId={this.state.longId}
                id={id}
                total={total}
                activeKey={activeKey}
                requestData={this.requestData}
                longLoading={this.state.longLoading}
                type="resident"
                popOne={popOne}
                handlePopShow={this.handlePopShow}
                handleTableKey={this.handleTableKey}
              />}
            </TabPane>
            <TabPane tab="长期未出现" key="2">
              {<RightTabPart
                recoverInitPage={this.recoverInitPage}
                RegisUnappList={RegisUnappList}
                outId={this.state.outId}
                id={id}
                activeKey={activeKey}
                total={UnAppearTotal}
                requestUnappear={this.requestUnappear}
                specLoading={this.state.specLoading}
                type="float"
                popTwo={popTwo}
                handlePopShow={this.handlePopShow}
                handleTableKey={this.handleTableKey}
              />}
            </TabPane>
            <TabPane tab="全部" key="3">
              {<RightTabPart
                recoverInitPage={this.recoverInitPage}
                allList={this.state.allList}
                allId={this.state.allId}
                id={id}
                activeKey={activeKey}
                total={this.state.allTotal}
                requestAllPerson={this.requestAllPerson}
                allLoading={this.state.allLoading}
                type="all"
                popTwo={popTwo}
                handlePopShow={this.handlePopShow}
                handleTableKey={this.handleTableKey}
              />}
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
export default ResidentPerson;
