import React from "react";
import AlarmState from "./alarmState";
import * as _ from "lodash";
import "./index.less";

const PersonnelClassify = Loader.loadBusinessComponent("PersonnelClassify");
const IconFont = Loader.loadBaseComponent("IconFont");
const VariousDeviceCount = Loader.loadBusinessComponent("VariousDeviceCount");
function sumArr(arr) {
  let a = 0;
  for (let i = 0; i < arr.length; i++) {
    a += parseInt(arr[i],10)?parseInt(arr[i],10):0;
  }
  return a;
}
class VillageMesDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showface: false,
      showcam: false,
      LongLiveTotal: 0,
      ReUnAppearTotal: 0,
      dataByDaysList: [],
      CameraList: []
    };
  }
  getPersonCount = id => {
    let { show } = this.state;
    this.setState({
      show: !show
    });
  };
  getFaceCapture = id => {
    let { showface } = this.state;
    this.setState({
      showface: !showface
    });
  };
  getCameraClassify = id => {
    this.setState({
      showcam: !this.state.showcam
    });
  };
  handleOnSelect = id => {
    this.props.handleVillageSelect(id);
  };

  render() {
    const { villageName, deviceCount, address, id, pictureUrl } =
      this.props.data || {};
    const {
      show,
      showcam,
      showface,
    } = this.state;
    let { choseId, type, otherData } = this.props;
    let dataByDaysList=otherData[0]&&otherData[0].trend&&otherData[0].trend.length>0?otherData[0].trend.map(v => parseInt(v.count,10)):[0,0,0,0,0,0,0];
    let judge = choseId == id;
    let countData=otherData[0]?otherData[0].deviceTypeCount:[];
    let countDevice=otherData[0]&&sumArr(otherData[0].deviceTypeCount.map(v => parseInt(v.count)))
    return (
      <div className={`left-community ${judge ? "back" : ""}`}>
        <div
          className="left-community-top"
          onClick={this.handleOnSelect.bind(this, id)}
        >
          <div className="community-img">
            {pictureUrl ? (
              <img src={pictureUrl} />
            ) : (
              <IconFont
                style={{ fontSize: "80px", color: "#D8DCE3" }}
                type={"icon-Dataicon__Dark4"}
                theme="outlined"
              />
            )}
          </div>
          <div className="flex-community">
            <span>{villageName}</span>
            <div className="community-word">{address}</div>
          </div>
        </div>
        <div className="card-mas-community">
          <div
            className="card-one"
            onClick={this.getPersonCount.bind(this, id)}
          >
            <span>
              <IconFont type={"icon-Often_Dark"} theme="outlined" />
              <span>
                {type == "unregistered" ? "未登记" : "已登记"}
                人员
              </span>
            </span>
            <span>人</span>
            <span className="font-resource-normal">
              {type =="unregistered"
                ? otherData[0]
                  ? parseFloat(otherData[0]?otherData[0].frequentlyCount*1+otherData[0].occasionallyCount*1:0).toLocaleString()
                  : "/"
                : otherData[0]
                ? parseFloat(otherData[0]?otherData[0].permanentCount*1+otherData[0].disappearCount*1:0).toLocaleString()
                : "/"}
            </span>
            <span className="plus-community">
              {!show ? (
                <IconFont type={"icon-Arrow_Small_Down_Mai"} theme="outlined" />
              ) : (
                <IconFont type={"icon-Arrow_Small_Up_Main"} theme="outlined" />
              )}
            </span>
          </div>
          {show && (
            <div className={`community-count ${show ? "show" : ""} `}>
              <PersonnelClassify
                LongLiveTotal={type=="unregistered"?otherData[0].frequentlyCount:otherData[0].permanentCount}
                ReUnAppearTotal={type=="unregistered"?otherData[0].occasionallyCount:otherData[0].disappearCount}
                type={type}
              />
            </div>
          )}
          <div
            className="card-one two"
            onClick={this.getCameraClassify.bind(this, id)}
          >
            <span>
              <IconFont type={"icon-Camera_Main"} theme="outlined" />
              <span>小区实有设备</span>
            </span>
            <span>台</span>
            <span className="font-resource-normal">{countDevice?countDevice:0}</span>
            <span className="plus-community">
              {!showcam ? (
                <IconFont type={"icon-Arrow_Small_Down_Mai"} theme="outlined" />
              ) : (
                <IconFont type={"icon-Arrow_Small_Up_Main"} theme="outlined" />
              )}
            </span>
          </div>
          {showcam && (
            <div className={`community-content ${showcam ? "showcam" : ""}`}>
              <VariousDeviceCount CameraList={countData} />
            </div>
          )}
          <div
            className="card-one three"
            onClick={this.getFaceCapture.bind(this, id)}
          >
            <span>
              <IconFont type={"icon-Control_White_Main"} theme="outlined" />
              <span>近七天人脸抓拍数</span>
            </span>
            <span>张</span>
            <span className="font-resource-normal">
              {type == "registered"
                ? otherData[0]
                  ? parseFloat(
                      otherData[0].total? otherData[0].total:0
                    ).toLocaleString()
                  : "/"
                : otherData[0]
                ? parseFloat(otherData[0].total?otherData[0].total:0).toLocaleString()
                : "/"}
            </span>
            <span className="plus-community">
              {!showface ? (
                <IconFont type={"icon-Arrow_Small_Down_Mai"} theme="outlined" />
              ) : (
                <IconFont type={"icon-Arrow_Small_Up_Main"} theme="outlined" />
              )}
            </span>
          </div>
          {showface && (
            <div
              className={`community-face-count  ${showface ? "showface" : ""}`}
            >
              <AlarmState dataByDaysList={dataByDaysList} />
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default VillageMesDetail;
