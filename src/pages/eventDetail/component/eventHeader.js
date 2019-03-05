import React from "react";
import { Progress, Input, Button } from "antd";
import moment from "moment";
import "./eventHeader.less";
const { TextArea } = Input;
const ImageView = Loader.loadBusinessComponent("ImageView");
const IconFont = Loader.loadBaseComponent("IconFont");
const AuthComponent = Loader.loadBusinessComponent("AuthComponent");

class KeyPersonHeader extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {
      data = {},
      handleText,
      operationDetail,
      handleOpenModal
    } = this.props;
    data.logType = 1;
    return (
      <div className="event-header">
        <div className="event-left">
          <div className="left-img">
            <div className="detailed-Cloth">
              <div className="cloth-img">
                <ImageView src={data.faceUrl} />
              </div>
              <p className="cloth-p">抓拍照片</p>
            </div>
          </div>
        </div>
        <div className="event-right">
          <div className="right-header">
            {data.isHandle === 0 ? (
              <div className="detail-text">
                <TextArea
                  className="detail-input"
                  placeholder="请输入警情备注，最大长度不超过200"
                  maxLength={201}
                  rows={4}
                  onChange={handleText}
                  value={operationDetail}
                />
                <AuthComponent actionName="eventHistoryNotify">
                  <div className="detail_header_button">
                    <Button
                      className="header_btn"
                      onClick={() => handleOpenModal(0)}
                    >
                      <IconFont type={"icon-YesNo_No_Main"} theme="outlined" />
                      无效
                    </Button>
                    <Button
                      className="header_btn"
                      onClick={() => handleOpenModal(1)}
                    >
                      <IconFont type={"icon-YesNo_Yes_Main"} theme="outlined" />
                      有效
                    </Button>
                  </div>
                </AuthComponent>
              </div>
            ) : (
              <p className="details-text-handled">
                {/* 警情备注： */}
                <span className="details-span">{data.operationDetail}</span>
              </p>
            )}
          </div>
          <div className="right-center">
            <div className="center-message">
              <p className="right-center-p" title={data.taskName}>
                <span className="right-center-span"> 所在布控任务：</span>
                {data.taskName || "-"}
              </p>
            </div>
            <div className="center-message">
              <p className="right-center-p" title={data.deviceName}>
                <span className="right-center-span">告警设备名称：</span>
                {data.deviceName || "-"}
              </p>
              <p className="right-center-p" title={data.address}>
                <span className="right-center-span">告警设备地址：</span>
                {data.address || "-"}
              </p>
              <p className="right-center-p">
                <span className="right-center-span">告警时间：</span>
                {(data &&
                  moment(+data.captureTime).format("YYYY.MM.DD HH:mm:ss")) ||
                  "-"}
              </p>
            </div>
          </div>
        </div>
        {data.isHandle == 1 && (
          <div
            className={`detailed_rotate ${
              data.isEffective == 0 ? "rotate_no" : "rotate_yes"
            } `}
          />
        )}
      </div>
    );
  }
}

export default KeyPersonHeader;
