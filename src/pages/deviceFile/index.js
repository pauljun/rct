import React from 'react';
import DeviceInfo from "./components/DeviceInfo";
import PlaceLabel from "./components/PlaceLabel";
import DevicePoint from "./components/DevicePoint";
import VisitorsFlowrate from "./components/VisitorsFlowrate";
import ResourceStatistics from "./components/ResourceStatistics";
import { message, Spin} from 'antd';
import './index.less';
class deviceFile extends React.Component {
  state = {
    deviceInfo: {},
    resources: {},
    vehiclesResources: {},
    cid: '',
    placeTags:[],
    initPlaceTags:[],
    loading: false,
    countDeviceCapPersonsData: {},
    countDeviceCapPersonsType: 2,
    nearDeviceList:[],
    counResourceStatisticsType: 2,
    vehicleResource:[],
    faceResource: [],
    bodyResource: [],
  };
  componentWillMount() {
    let { location } = this.props;
    let searchJson = Utils.queryFormat(location.search);
    this.setState({
      cid: searchJson.id
    },() => {
      this.ininData()
    })
  }

  ininData = () => {
    let {cid,countDeviceCapPersonsType} = this.state
    this.setState({
      loading: true
    })
    Promise.all([
      Service.device.queryDeviceInfoByCid(cid),
      Service.place.countDeviceResources({cids:[cid]}),
      Service.place.countVehiclesByCids({cids:[cid]}),
      Service.place.countDeviceCapPersons({
        cids: [cid],
        timeType: countDeviceCapPersonsType,
      }),
      Service.statistics.countByDays({
        cids:[cid],
        startTime: new Date() * 1 - 7*24*60*60*1000,
        endTime: new Date() * 1,
      }),
      Service.statistics.countPersonDayTrend({
        cids: [cid],
        type:1,
        days:7
      }),
      Service.statistics.countPersonDayTrend({
        cids: [cid],
        type: 2,
        days: 7
      }),
    ]).then(resultArr => {
      this.setState({
        deviceInfo: resultArr[0].data,
        placeTags: resultArr[0].data.placeTags,
        initPlaceTags: resultArr[0].data.placeTags,
        resources: resultArr[1].data,
        vehiclesResources: resultArr[2].data,
        countDeviceCapPersonsData: resultArr[3].data,
        vehicleResource: resultArr[4].data,
        faceResource: resultArr[5].data.list,
        bodyResource: resultArr[6].data.list,
        loading: false,
      })
      Service.place.queryDeviceByCenter({
        center: `${resultArr[0].data.longitude},${resultArr[0].data.latitude}`,
        distance: 500,
      }).then(result => {
        this.setState({
          nearDeviceList: result.data
        })
      })
    })

  }
  //人流量分布规律
  countDeviceCapPersons = (timeType) => {
    let {cid} = this.state
    Service.place.countDeviceCapPersons({
      cids:[cid],
      timeType,
    }).then(res => {
      this.setState({
        countDeviceCapPersonsData: res.data
      });
    });
  };
  countDeviceCapPersonsTypeChange = (v) => {
    this.setState({
      countDeviceCapPersonsType: v
    }, () => {
      this.countDeviceCapPersons( v)
    })
  }
  //​抓拍资源统计
  counResourceStatistics = (v) => {
    let time=7
    if(v ===3){
      time=31
    }
    let {cid} = this.state
    Promise.all([
      Service.statistics.countByDays({
        cids:[cid],
        startTime: new Date() * 1 - time*24*60*60*1000,
        endTime: new Date() * 1,
      }),
      Service.statistics.countPersonDayTrend({
        cids: [cid],
        type:1,
        days:time
      }),
      Service.statistics.countPersonDayTrend({
        cids: [cid],
        type: 2,
        days: time
      }),
    ]).then(resultArr => {
      this.setState({
        vehicleResource: resultArr[0].data,
        faceResource: resultArr[1].data.list,
        bodyResource: resultArr[2].data.list,
      })
    })    
  };
  counResourceStatisticsTypeChange = (v) => {
    this.setState({
      counResourceStatisticsType: v
    }, () => {
      this.counResourceStatistics( v)
    })
  }
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
      placeTags: this.state.initPlaceTags
    })
  }
  handleLabelOK = () => {
    let {
      placeId,
      placeTags
    } = this.state
    Service.place.playPlaceTagsById({
      placeId,
      tags: placeTags
    }).then(v => {
      message.success('添加标签成功')
      this.queryPlaceInfo()
    })
  }
  render() {
    let {loading,deviceInfo,resources,vehiclesResources,countDeviceCapPersonsData,countDeviceCapPersonsType,placeTags,initPlaceTags,nearDeviceList,vehicleResource,faceResource,bodyResource,counResourceStatisticsType} = this.state
    let deviceInfoData = Object.assign({},deviceInfo,resources,vehiclesResources);
    return (
      <div className="device-file-view">
        < div className = 'device-file-nav' >
          <div className="device-file-title">
            <div className="panel-name">设备档案</div>
          </div>
          < div className = "device-file-header" ></ div>
        </div>
        {/* < div className = 'device-file-content' > */}
          <Spin spinning={loading} wrapperClassName='device-file-content' >
            < div className = 'device-file-detail' >
              < DeviceInfo data ={deviceInfoData}/>
              < PlaceLabel 
                placeTags={placeTags} 
                initPlaceTags={initPlaceTags} 
                itemClick={this.itemClick}
                handleLabelCancel={this.handleLabelCancel}
                handleLabelOK={this.handleLabelOK}
              />
              < ResourceStatistics vehicleResource = {vehicleResource} faceResource={faceResource} bodyResource={bodyResource} type={counResourceStatisticsType} typeChange={this.counResourceStatisticsTypeChange}/>
              < VisitorsFlowrate data={countDeviceCapPersonsData} type={countDeviceCapPersonsType} typeChange={this.countDeviceCapPersonsTypeChange}/>
              < DevicePoint point ={deviceInfo} nearDeviceList={nearDeviceList}/>
              <div className='footerView'></div>
            </div>
          </Spin>
        {/* </div> */}
      </div>
    );
  }
}

export default deviceFile