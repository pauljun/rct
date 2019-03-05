import React from 'react';
import PlaceTree from "./components/PlaceTree";
import PlaceInfo from "./components/PlaceDetail/PlaceInfo";
import VisitorsFlowrate from "./components/PlaceDetail/VisitorsFlowrate";
import PlaceLabel from "./components/PlaceDetail/PlaceLabel";
import PlaceDevice from "./components/PlaceDetail/PlaceDevice";
import TravelRule from "./components/PlaceDetail/TravelRule";
import PersonnelComposition from "./components/PlaceDetail/PersonnelComposition";
import './index.less';
import { message,Spin } from 'antd';
const SearchInput = Loader.loadBaseComponent("SearchInput");
@Decorator.businessProvider('place', 'user')
class placeFile extends React.Component {

  state = {
    placeInfo: {},
    resources: {},
    vehiclesResources: {},
    deviceList: [],
    deviceNum: 0,
    placeTypeNum: {},
    countPersonFrequencyType: 1,
    countPersonNumType: 2,
    placeNum: 0,
    placeTags:[],
    initPlaceTags:[],
    placeId: '',
    frequentPersonnelNum: 0,
    temporaryPersonnelNum: 0,
    unFrequentPersonnelNum: 0,
    countPersonNumData: {},
    countPersonFrequencyData: {},
    placeTreeData:[],
    placeArray:[],
    loading:false,
    placeTotal:0,
    expandedRowKeys:[],
    keyword:null,
    signature:'',
  };

   componentWillMount() {
    let {place ,user } = this.props
    //获取用户能看到的场所id列表
    Service.organization.getPlaceIdsByUserId({
      organizationId: user.userInfo.organizationId
    }).then(res => {
      let placeArray = place.getPlaceInfoByIds(res.data.placeIds)
      let placeTreeData = Utils.computPlaceTree(placeArray)
      let placeTotal=0
      placeTreeData.forEach(v => {
        placeTotal += v.childrenPlaceCount
      })
      this.setState({
        placeTreeData,
        placeArray,
        placeTotal,
        placeId: placeTreeData[0] &&placeTreeData[0].placeId,
        signature: placeTreeData[0] && placeTreeData[0].signature
      },() => {
        this.initData()
      })
    })
  }
  initData = () => {
    let { placeId,countPersonFrequencyType,signature,countPersonNumType} = this.state
    const { qj, znxj, zpj, db } = Dict.map;
    if (!placeId){
      return
    }
    this.setState({
      loading:true
    })

    // Service.place.queryPlaceInfo({
    //   id: placeId,
    //   signature
    // }).then(res => {
    //   console.log(res)
    // })
    Promise.all([
      Service.place.queryPlaceInfo({id: placeId,signature}),
      Service.device.queryDevices({ placeIds:[ placeId],limit:100000 ,deviceTypes: [+qj.value, +znxj.value, +zpj.value, +db.value]}),
      Service.place.countMinPlaces({ placeId: placeId }),
      Service.place.countMinPlaces({ placeId: placeId, tags: [119101, 119104, 119108, 119113, 119115] }),
      Service.place.countResources({ placeIds: [placeId] }),
      Service.place.countVehiclesResources({ placeIds: [placeId] }),
      Service.place.countTypeByPid({ placeIds: [placeId], inAndOutType: 1 }),
      Service.place.countTypeByPid({ placeIds: [placeId], inAndOutType: 2 }),
      Service.place.countTypeByPid({ placeIds: [placeId], inAndOutType: 3 }),
      Service.place.countPersonFrequency({placeIds: [placeId], timeType: countPersonFrequencyType}),
      Service.place.countPersonNum({placeIds: [placeId],timeType:countPersonNumType})
    ]).then(resultArr => {
      this.setState({
        placeInfo: resultArr[0].data,
        placeTags: resultArr[0].data && resultArr[0].data.placeTags,
        initPlaceTags: resultArr[0].data && resultArr[0].data.placeTags,
        deviceList: resultArr[1].data.list,
        deviceNum: resultArr[1].data.total,
        placeNum: resultArr[2].data,
        placeTypeNum: resultArr[3].data,
        resources: resultArr[4].data,
        vehiclesResources: resultArr[5].data,
        frequentPersonnelNum: resultArr[6].data,
        temporaryPersonnelNum: resultArr[7].data,
        unFrequentPersonnelNum: resultArr[8].data,
        countPersonFrequencyData: resultArr[9].data,
        countPersonNumData: resultArr[10].data,
        loading:false,
      });
    })
  }

  //获取场所信息
  queryPlaceInfo= () => {
    let {placeId} = this.state
    Service.place.queryPlaceInfo({
      id: placeId
    }).then(res => {
      this.setState({
        placeInfo: res.data,
        placeTags: res.data&&res.data.placeTags,
        initPlaceTags: res.data&&res.data.placeTags,
      });
    });
  }

  //出行规律
  countPersonFrequency = (placeIds, timeType) => {
    Service.place.countPersonFrequency({
      placeIds,
      timeType
    }).then(res => {
      this.setState({
        countPersonFrequencyData: res.data
      });
    });
  };
  countPersonFrequencyTypeChange = (v) => {
    let {placeId}=this.state
    this.setState({
      countPersonFrequencyType:v
    },() => {
      this.countPersonFrequency([placeId],v)
    })
  }
  //人流量分布规律
  countPersonNum = (placeIds, timeType) => {
    Service.place.countPersonNum({
      placeIds,
      timeType
    }).then(res => {
      this.setState({
        countPersonNumData: res.data
      });
    });
  };
  countPersonNumTypeChange = (v) => {
    let {
      placeId
    } = this.state
    this.setState({
      countPersonNumType: v
    }, () => {
      this.countPersonNum([placeId], v)
    })
  }
  //选择场所
  onSelectPlace = data => {
    let {placeId} = this.state
    if (placeId === data.placeId) {
      return
    }
    this.setState({placeId:data.placeId,signature:data.signature},() => {
      this.initData()
    })
  }
  //展开
  onExpand = (expanded, record) => {
    let {expandedRowKeys} = this.state
    this.setState({
      expandedRowKeys: expanded ? expandedRowKeys.concat(record.placeId) : expandedRowKeys.filter(v => {
        return v !== record.placeId
      })
    })
  }
  //搜索
  inputHandleChange = value => {
    const {place} = this.props
    const { placeArray,placeId } = this.state;
    let expandedRowKeys = [];
    if (!value) {
      if (placeId){
        const id = placeArray.find(
          v => v.placeId === placeId
        ).id;
        let placeIds = place.getParentPlaceListById(id).map(v => {
          if (v.placeId !== placeId){
            return v.placeId
          }
        })
        expandedRowKeys = placeIds;
      }
    } else {
      const orgs = placeArray.filter(
        v => v.name.indexOf(value) > -1
      );
      let placeIds = place.getParentPlaceListByIds(orgs.map(v => v.id)).map(v => v.placeId)
      expandedRowKeys = placeIds
    }
    this.setState({
      expandedRowKeys,
      keyword: value,
    })
  };
  //选标签
  itemClick = (value) => {
    let {
      placeTags
    } = this.state
    if (placeTags.indexOf(value) >= 0) {
      placeTags = placeTags.filter(v => {
        return v !== value
      })
    } else {
      placeTags = placeTags.concat(value);
    }
    this.setState({
      placeTags
    })
  }
  handleLabelCancel = () => {
    this.setState({
      placeTags:this.state.initPlaceTags
    })
  }
  handleLabelOK = () => {
    let {placeId,placeTags} = this.state
    Service.place.playPlaceTagsById({
      placeId,
      tags:placeTags
    }).then(v => {
      message.success('设置标签成功')
      this.queryPlaceInfo()
    })
  }
  render() {
    let {
      loading,
      placeId,
      placeInfo,
      resources,
      vehiclesResources,
      deviceList,
      deviceNum,
      placeNum,
      initPlaceTags,
      frequentPersonnelNum,
      temporaryPersonnelNum,
      unFrequentPersonnelNum,
      countPersonFrequencyData,
      countPersonFrequencyType,
      placeTypeNum,
      placeTags,
      placeTreeData,
      countPersonNumType,
      countPersonNumData,
      placeTotal,
      expandedRowKeys,
      keyword,
    } = this.state;
    let personnelNum = {
      frequentPersonnelNum,
      temporaryPersonnelNum,
      unFrequentPersonnelNum
    };
    let placeInfoData = Object.assign({},
      placeInfo,
      resources,
      vehiclesResources, {
        deviceNum
      }, {
        placeNum
      }
    );
    return (
      <div className="place-file-view">
        < div className = 'place-file-nav' >
          <div className="place-file-title">
            <div className="panel-name">场所档案&nbsp;&nbsp;{this.props.user.userInfo.addressCode}</div>
            <div className="place-num-box">
              <div className="place-num-title">场所数：</div>
              <div className="place-num  primary-color">{placeTotal}</div>
            </div>
          </div>
          < div className = "place-file-header" ></ div>
        </div>
        < div className = 'place-file-content' >
          <div className="place-list-view">
            <div className="list-search">
              <SearchInput
                size={"lg"}
                style={{ color: "rgba(0,0,0,.25)" }}
                placeholder="请输入场所名称或类型进行查找"
                onChange={this.inputHandleChange}
              />
            </div>
            <PlaceTree data={placeTreeData} placeId={placeId} onSelect={this.onSelectPlace} expandedRowKeys={expandedRowKeys} onExpand={this.onExpand} keyword={keyword}/>
          </div>
          <Spin spinning={loading} wrapperClassName='place-detail-view' >
            <div className="place-content-view">
              <PlaceInfo placeInfoData={placeInfoData} />
              {
                placeInfo.level>=4&&
                <PlaceLabel 
                  placeTags={placeTags} 
                  initPlaceTags={initPlaceTags} 
                  itemClick={this.itemClick}
                  handleLabelCancel={this.handleLabelCancel}
                  handleLabelOK={this.handleLabelOK}
                />
              }
              <PlaceDevice deviceList={deviceList} placeTypeNum={placeTypeNum} placeInfo={placeInfo}/>
              <TravelRule data={countPersonFrequencyData} type={countPersonFrequencyType} countPersonFrequencyTypeChange={this.countPersonFrequencyTypeChange}/>
              <VisitorsFlowrate data={countPersonNumData} type={countPersonNumType} countPersonNumTypeChange={this.countPersonNumTypeChange}/>
              <PersonnelComposition personnelNum={personnelNum} placeId={placeId}/> 
            </div>
          </Spin>
        </div>
      </div>
    );
  }
}

export default placeFile