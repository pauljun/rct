import React from "react";
import { withRouter } from "react-router-dom";
import { observer } from "mobx-react";
import { toJS } from "mobx";
import CommunityList from "./components/communityList";
import CommunityDetail from "./components/communityDetail";
//import CommunityChart from "./components/communityChart";

import "./index.less";
import { Promise } from "q";

const CommunityMap = Loader.loadBusinessComponent(
  "MapComponent",
  "CommunityMap"
);

@withRouter
@Decorator.businessProvider("tab", "user", "device")
@observer
class ModuleView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      villageList: [],
      solidCount: {},
      points: [],
      selectId: "",
      filterVillageList: [],
      ProVillageList: [],
      resource: []
    };
    this.communityRef = React.createRef();
    this.init();
    //this.getVillSolidData();
    //this.getDeviceList();
  }

  init() {
    this.getVillageList().then(list => {
      let villageIds = [];
      list.map(v => villageIds.push(v.id));
      if (villageIds.length === 0) {
        return;
      }
      //this.getDeviceList(villageIds);
      Promise.all([
        Service.community.countVillagePeople({ villageIds }),
        Service.community.countVillageDevice({ villageIds }),
        Service.community.countVillageResource({ villageIds })
      ]).then(res => {
        res[0].map(item => {
          try {
            Object.assign(list.find(v => v.id === item.id), item);
          } catch (e) {}
        });
        res[1].map(item => {
          try {
            Object.assign(list.find(v => v.id === item.id), item);
          } catch (e) {}
        });
        this.setState({
          villageList: list,
          ProVillageList: list,
          filterVillageList: list,
          resource: res[2]
        });
      });
    });
  }

  clickCommunity = data => {
    this.communityRef.current.jumpCommunity(data.id);
    /*  this.setState({
      selectId: data.id
    }); */
    Promise.all([
      Service.community.countVillagePeople({ villageIds: [data.id] }),
      Service.community.countVillageDevice({ villageIds: [data.id] }),
      Service.community.countVillageResource({ villageIds: [data.id] })
    ]).then(res => {
      res[0].map(item => {
        try {
          Object.assign(data.find(v => v.id === item.id), item);
        } catch (e) {}
      });
      res[1].map(item => {
        try {
          Object.assign(data.find(v => v.id === item.id), item);
        } catch (e) {}
      });
      this.setState({
        filterVillageList: [data],
        selectId: data.id,
        resource: res[2]
      });
    });
  };
  refreshAllMes = () => {
    let { ProVillageList } = this.state;
    let ids = ProVillageList.map(v => v.id);
    Service.community.countVillageResource({ villageIds: ids }).then(res => {
      this.setState({
        resource: res,
        filterVillageList: ProVillageList
      });
    });
    /*  this.setState({
      filterVillageList:villageList
    }) */
  };
  // 获取小区总览列表
  getVillageList = async (keyWord = "") => {
    let option = {
      keywords: keyWord,
      limit: 1000,
      offset: 0
    };
    let res = await Service.community.statisticsList(option);
    /*    this.setState({
      villageList: res.list,
      filterVillageList: res.list
    }); */
    return res.list;
  };

  getVillSolidData = () => {
    let userId = this.props.user.userInfo.id;
    Service.community.getCountVillageSolidData({ userId }).then(res => {
      this.setState({
        solidCount: res
      });
    });
  };
  restMap = () => {
    this.setState({
      selectId: ""
    });
  };
  webGetVillageList = keyWord => {
    let { ProVillageList} = this.state;
    let filterVillageList = ProVillageList.filter(
      v => v.villageName.indexOf(keyWord) > -1
    );
    let ids=filterVillageList.map(v => v.id);
    Service.community.countVillageResource({ villageIds: ids }).then(res => {
      if (keyWord.length > 0) {
        this.setState({
          filterVillageList,
          villageList: filterVillageList,
          resource:res
        });
      } else {
        this.setState({
          filterVillageList,
          villageList: ProVillageList,
          resource:res
        });
      }
    })
   
  };
  render() {
    const {
      filterVillageList,
      solidCount,
      points,
      selectId,
      resource,
      villageList
    } = this.state;
    const { device } = this.props;
    let allPoints = [];
    let pointsTest = toJS(device.deviceList);
    if (selectId) {
      allPoints = points.filter(v => v.villageId === selectId);
    } else {
      allPoints = points;
    }
    return (
      <div className="community_entry">
        <CommunityMap
          points={pointsTest}
          villages={filterVillageList}
          ref={this.communityRef}
        />
        <CommunityList
          restMap={this.restMap}
          getVillageList={this.webGetVillageList.bind(this)}
          data={villageList}
          clickCommunity={this.clickCommunity}
          refreshAllMes={this.refreshAllMes}
        />
        <CommunityDetail
          resource={resource}
          filterVillageList={filterVillageList}
        />
      </div>
    );
  }
}

export default ModuleView;
