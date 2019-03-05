import React, { Component } from "react";
import "./communityDetail.less";
import CommunityBelongings from "./communityBelongingStatistic";

const CommunityChartCard = Loader.loadBusinessComponent(
  "Card",
  "CommunityChartCard"
);
function sumArr(arr) {
  let a = 0;
  for (let i = 0; i < arr.length; i++) {
    a += parseInt(arr[i], 10) ? parseInt(arr[i], 10) : 0;
  }
  return a;
}
@Decorator.businessProvider("tab", "user")
class CommunityDetail extends Component {
  constructor(props) {
    super(props);
  }

  thousand(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
  }
  handleRequestData = data => {
    for (let i = 0; i < data.length; i++) {
      data[i];
    }
  };
  filterDeviceCount(arr) {//分类出所需设备数量
    let doorCam = [],
      carCam = [],
      cam = [];
    for (let i = 0; i < arr.length; i++) {
      doorCam = doorCam.concat(
        arr[i]
          .filter(v => v.deviceType == 103501 || v.deviceType == 103502)
          .map(v => v.count)
      );
      carCam = carCam.concat(
        arr[i].filter(v => v.deviceType == 103407).map(v => v.count)
      );
      cam = cam.concat(
        arr[i]
          .filter(
            v =>
              v.deviceType == 100604 ||
              v.deviceType == 100603 ||
              v.deviceType == 100602
          )
          .map(v => v.count)
      );
    }
    let caldoorcam = sumArr(doorCam);
    let calcarcam = sumArr(carCam);
    let calcam = sumArr(cam);
    return { caldoorcam, calcarcam, calcam };
  }
  render() {
    let { filterVillageList, resource } = this.props;
    let registeredCount = sumArr(filterVillageList.map(v => v.disappearCount*1+v.permanentCount*1));//登记人口数量
    let unRegisteredCount = sumArr(
      filterVillageList.map(v => v.frequentlyCount*1+v.occasionallyCount*1)
    );//未登记人口数量
    let houseCount = sumArr(filterVillageList.map(v => parseInt(v.houseCount)));//房屋数量
    let deviceItemArr = filterVillageList
      .map(
        v =>
          v.deviceTypeCount && v.deviceTypeCount.length > 0 && v.deviceTypeCount
      )
      .filter(v => !!v);//分类出设备数组
    let countDeviceFilter =
      deviceItemArr &&
      deviceItemArr.length > 0 &&
      this.filterDeviceCount(deviceItemArr); //设备分类结果
    let countDevice = deviceItemArr.map(v => {
      return Array.isArray(v) && v.map(v => v.count);
    });
    let totalCount = sumArr(
      countDevice.map(v => {
        return sumArr(v);
      })
    );//设备总数量
    let faceCount = sumArr(resource.map(v => v.faceCount));
    let bodyCount = sumArr(resource.map(v => v.bodyCount));
    let vehicleCount = sumArr(
      resource.map(v => (v.vehicleCount ? v.vehicleCount : 0))
    );

    let baseMes = {
      villageCount: filterVillageList.length,
      houseCount,
      deviceCount: totalCount
    };
    let camCount=countDeviceFilter.calcam ? countDeviceFilter.calcam : 0;
    let carcamCount= countDeviceFilter.calcarcam
    ? countDeviceFilter.calcarcam
    : 0;
    let doorCamCount=countDeviceFilter.caldoorcam
    ? countDeviceFilter.caldoorcam
    : 0;
    return (
      <div className="community-resourse-count">
        <div className="community-container">
          <CommunityBelongings baseMes={baseMes} />
          <CommunityChartCard
            title="人员"
            filterData={[
              {
                name: "已登记人员",
                value: registeredCount ? registeredCount : 0,
                icon: "icon-Dataicon__Dark4"
              },
              {
                name: "未登记人员",
                value: unRegisteredCount ? unRegisteredCount : 0,
                icon: "icon-New__Main1"
              }
            ]}
            data={[
              registeredCount ? registeredCount : 0,
              unRegisteredCount ? unRegisteredCount : 0
            ]}
            myColor={["#FFAA00", "#D8DCE3"]}
          />
          <CommunityChartCard
            title="设备"
            filterData={[
              {
                name: "摄像机",
                value: camCount,
                icon: "icon-_Camera__Main3"
              },
              {
                name: "道闸",
                value:carcamCount,
                icon: "icon-Dataicon__Dark"
              },
              {
                name: "门禁",
                value: doorCamCount,
                icon: "icon-Entrance_Guard"
              }
            ]}
            data={[camCount, carcamCount, doorCamCount]}
            myColor={["#4CC4F8", "#8899BB", " #D8DCE3"]}
          />
          <CommunityChartCard
            resource={true}
            title="资源"
            filterData={[
              { name: "人脸", value: faceCount, icon: "icon-Face_Dark" },
              { name: "人体", value: bodyCount, icon: "icon-Body_Main" },
              { name: "机动车", value: vehicleCount, icon: "icon-Car_Main" },
              /* { name: "非机动车", value: 0, icon: "icon-NonMotor_Dark" } */
            ]}
            data={[faceCount, bodyCount, vehicleCount]}
            myColor={["#0FC484", "#50E9B2", "#8899BB", "#D8DCE3"]}
          />
        </div>
      </div>
    );
  }
}

export default CommunityDetail;
