import React, { Component } from "react";
import { Tabs } from "antd";
import { withRouter } from "react-router-dom";
import { observer } from "mobx-react";
import FloatPersonTab from "./components/FloatPersonTab/index";
import MesRefresh from "../communityRegistered/components/MesRefresh";

import "./index.less";

const VillageResourceList = Loader.loadBusinessComponent("VillageResourceList");

const TabPane = Tabs.TabPane;
@Decorator.withEntryLog()
@withRouter
@Decorator.businessProvider("flowPerson",'tab')
@observer
class flowPerson extends Component {
  constructor(props) {
    super(props);
    this.options = {
      page: 0
    };
    this.unoptions = {
      page: 0
    };
    this.allOptions = {
      page: 0
    };
    this.state = {
      selectIf: true,
      NewFaceList: [],
      UnLongExistList: [],
      allList:[],
      activeKey: "2",
      realLoading: true,
      floatLoading: true,
      allLoading:true,
      total: 0,
      anotherTotal: 0,
      allTotal:0,
      choseId: undefined,
      popOne: false,
      popTwo: false,
      popThree:false,
      id: Math.random(),
      onceId:Math.random(),
      alwId:Math.random(),
      allId:Math.random(),
    };
    this.initData();
  }
  initData() {
    SocketEmitter.on(SocketEmitter.eventName.updatePerson, this.ProcessHandle);
  }
  componentWillUnmount() {
    SocketEmitter.off(SocketEmitter.eventName.updatePerson, this.ProcessHandle);
  }
  ProcessHandle = () => {
    let { activeKey } = this.state;
    let {flowPerson}=this.props;
    flowPerson.editSearchData({offset:0},activeKey);
    if (activeKey == 1) {
      this.requestData(true);
    }
    if (activeKey == 2) {
      this.requestDataExist(true);
    }
    if (activeKey == 3) {
      this.requestAllFlowPerson(true);
    }
    setTimeout(() => {
      this.backTop();
    }, 500);
  };

  requestData = (show,loadmore) => {
    const { flowPerson } = this.props;
    let {NewFaceList}=this.state;
    if (!show) {
      flowPerson.initSearchData(1);
    }
    if(loadmore){
      this.unoptions.page++;
      flowPerson.editSearchData({offset:(this.unoptions.page)*36},1)
    }else {
      this.setState({
        floatLoading: true
      });
    }
    Service.community
      .queryUnregisteredPeople(flowPerson.FloatsearchOption)
      .then(res => {
        this.setState({
          NewFaceList:loadmore?NewFaceList.concat(res.list):res.list,
          total: res.total,
          floatLoading: false
        });
      });
  };
  requestDataExist = (show,loadmore) => {
    const { flowPerson } = this.props;
    let {UnLongExistList}=this.state;
    if (!show) {
      flowPerson.initSearchData(2);
    }
    if(loadmore){
      this.options.page++;
      flowPerson.editSearchData({offset:(this.options.page)*36},2)
    }else {
      this.setState({
        realLoading: true
      });
    }
    Service.community
      .queryUnregisteredPeople(flowPerson.FloatsearchOptionUnappear)
      .then(res => {
        this.setState({
          UnLongExistList: loadmore?UnLongExistList.concat(res.list):res.list ,
          anotherTotal: res.total,
          realLoading: false
        });
      });
  };
  requestAllFlowPerson = (show,loadmore) => {
    const { flowPerson } = this.props;
    const {allList}=this.state;
    if (!show) {
      flowPerson.initSearchData(3);
    }
    if(loadmore){
      this.allOptions.page++;
      flowPerson.editSearchData({offset:(this.allOptions.page)*36},3)
    }else {
      this.setState({
        allLoading: true
      });
    }
    Service.community
      .queryUnregisteredPeople(flowPerson.allFloatSearchOption)
      .then(res => {
        this.setState({
          allList:loadmore?allList.concat(res.list):res.list,
          allTotal: res.total,
          allLoading: false
        });
      });
  };
  /**刷新 */
  FreShen = () => {
    this.requestData(true);
    this.requestDataExist(true);
    this.requestAllFlowPerson(true);
  };
  handleTableKey = key => {
    if (key) {
      this.setState({
        activeKey: key,
        popOne: false,
        popTwo: false,
        popThree:false
      });
    } else {
      this.setState({
        popOne: false,
        popTwo: false,
        popThree:false
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
    } 
    if(activeKey==2) {
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
    if(activeKey==3) {
      if (type) {
        this.setState({
          popThree: true
        });
      } else {
        this.setState({
          popThree: false
        });
      }
    }
  };
  /**处理社区总览跳转选中小区的问题 */
  componentDidMount() {
    const { flowPerson } = this.props;
    const id = this.props.location.search.substring(4, 80);
    flowPerson.initImgandVal();
    flowPerson.initSearchData(1);
    flowPerson.initSearchData(2);
    flowPerson.initSearchData(3);
    if (id.length > 0&&id.length<16) {
      flowPerson.editSearchData({ villageIds: [id] }, 1);
      flowPerson.editSearchData({ villageIds: [id] }, 2);
      flowPerson.editSearchData({ villageIds: [id] }, 3);
      this.setState({
        choseId: id,
        selectIf: false
      });
      this.requestDataExist(true);
      this.requestData(true);
      this.requestAllFlowPerson(true);
    }else if(id.length>16) {
      LM_DB.get('parameter',this.props.location.search.substring(4, 80)).then(res => {
        let activeKey=res.activeKey;
        let villageIds=res.communitySearchdata&&res.communitySearchdata.villageIds.length==1?
        res.communitySearchdata.villageIds[0]:undefined;
        if(villageIds){
          flowPerson.editSearchData({villageIds:[villageIds]},1);
          flowPerson.editSearchData({villageIds:[villageIds]},2);
          flowPerson.editSearchData({villageIds:[villageIds]},3);
        }
        flowPerson.editSearchData(res.communitySearchdata,activeKey);
       this.setState({
        activeKey, 
        choseId:villageIds,
        selectIf:villageIds?false:true
       })
       this.requestDataExist(true);
      this.requestData(true);
      this.requestAllFlowPerson(true);
      });
    } else {
      this.requestDataExist();
      this.requestData();
      this.requestAllFlowPerson();
    }
  }
  HandleNoVillageData = () => {
    this.setState({
      NewFaceList: [],
      UnLongExistList: []
    });
  };
  /**处理上传图片与输入的查询内容 */
  handleSelctId = () => {
    //this.backTop();
    this.setState({
      id: Math.random()
    });
    this.props.flowPerson.deleteImgAndVal(1, 1);
    this.props.flowPerson.deleteImgAndVal(2, 1);
    this.props.flowPerson.deleteImgAndVal(3, 1);
    this.recoverInitPage()
  };
  backTop = () => {
    let { activeKey } = this.state;
    if (activeKey == 1) {
      this.setState({
        onceId: Math.random()
      });
    }
    if (activeKey == 2) {
      this.setState({
        alwId: Math.random()
      });
    }
    if (activeKey == 3) {
      this.setState({
        allId: Math.random()
      });
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
        moduleName: 'communityUnRegistered',
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
      NewFaceList,
      total,
      UnLongExistList = [],
      anotherTotal,
      choseId,
      id,
      popOne,
      popTwo,
      popThree,
      allTotal
    } = this.state;
    return (
      <div className="community_float_alarm_box">
        <div className="community_left_total">
          <VillageResourceList
          activeKey={activeKey}
            updateUrl={this.updateUrl}
            handleSelctId={this.handleSelctId}
            type="unregistered"
            HandleNoVillageData={this.HandleNoVillageData}
            requestData={this.requestData}
            requestUnappear={this.requestDataExist}
            requestAllPerson={this.requestAllFlowPerson}
            choseId={choseId}
            selectIf={selectIf}
          />
        </div>
        <div className="community_right_container">
          <MesRefresh
            title="未登记人员总数"
            total={activeKey == 1 ? total :(activeKey == 2? anotherTotal:allTotal)}
            FreShen={this.FreShen}
          />
          <Tabs type="card" onChange={this.handleTableKey} activeKey={activeKey}>
            <TabPane tab="频繁出现" key="2">
             <FloatPersonTab
                UnLongExistList={UnLongExistList}
                NewFaceList={NewFaceList}
                allList={this.state.allList}
                total={anotherTotal}
                alwId={this.state.alwId}
                requestDataExist={this.requestDataExist}
                onChange={this.onChange}
                activeKey={activeKey}
                realLoading={this.state.realLoading}
                id={id}
                type="freoccur"
                popTwo={popTwo}
                handlePopShow={this.handlePopShow}
                handleTableKey={this.handleTableKey}
                recoverInitPage={this.recoverInitPage}
              />
            </TabPane>
            <TabPane tab="偶尔出现" key="1">
              <FloatPersonTab
                onceId={this.state.onceId}
                UnLongExistList={UnLongExistList}
                NewFaceList={NewFaceList}
                allList={this.state.allList}
                total={total}
                requestData={this.requestData}
                onChange={this.onChange}
                activeKey={activeKey}
                floatLoading={this.state.floatLoading}
                id={id}
                type="occasion"
                popOne={popOne}
                handlePopShow={this.handlePopShow}
                handleTableKey={this.handleTableKey}
                recoverInitPage={this.recoverInitPage}
              />
            </TabPane>
            <TabPane tab="全部" key="3">
             <FloatPersonTab
                allId={this.state.allId}
                UnLongExistList={UnLongExistList}
                NewFaceList={NewFaceList}
                allList={this.state.allList}
                total={this.state.allTotal}
                requestAllPerson={this.requestAllFlowPerson}
                onChange={this.onChange}
                activeKey={activeKey}
                allLoading={this.state.allLoading}
                id={id}
                type="all"
                popThree={popThree}
                handlePopShow={this.handlePopShow}
                handleTableKey={this.handleTableKey}
                recoverInitPage={this.recoverInitPage}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
export default flowPerson;
