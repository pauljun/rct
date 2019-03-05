import React from "react";
import { Progress, Input, Button } from "antd";
import moment from "moment";
import "./header.less";
const { TextArea } = Input;
const ImageView = Loader.loadBusinessComponent("ImageView");
const AuthComponent = Loader.loadBusinessComponent("AuthComponent");
const IconFont = Loader.loadBaseComponent("IconFont");

class KeyPersonHeader extends React.Component {
  constructor(props) {
    super(props);
    this.logType = [
      { key: 1, value: "黑名单报警" },
      { key: 2, value: "白名单报警" },
      { key: 3, value: "事件报警" },
      { key: 4, value: "白名单比对记录" },
      { key: 5, value: "一体机黑名单报警" },
      { key: 6, value: "APP临时任务报警" }
    ];
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
      <div className="key-point-header">
        <div className="key-point-left">
          <div className="left-img">
            <div className="detailed-Cloth">
              <div className="cloth-img">
                <ImageView src={data.imageUrl} type="multiple" />
              </div>
              <p className="cloth-p">布控人脸</p>
            </div>
            <div className="detailed-Cloth">
              <div className="cloth-img">
                <ImageView src={data.faceUrl} type="multiple" />
              </div>
              <p className="cloth-p">抓拍人脸</p>
            </div>
          </div>
          <div className="header-progress">
            <span className="progress-span">相似度</span>
            <Progress
              percent={data.score && Math.floor(data.score)}
              status="active"
              strokeWidth={4}
            />
          </div>
        </div>
        <div className="key-point-right">
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
                <AuthComponent actionName="keyPersonnelHistory">
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
            <p
              className="right-center-p"
              title={data.objectMainJson && data.objectMainJson.name}
            >
              <span className="right-center-span">姓名：</span>
              {(data.objectMainJson && data.objectMainJson.name) || "-"}
            </p>
            <p className="right-center-p" title={data.libName}>
              <span className="right-center-span"> 所在布控库：</span>
              {data.libName || "-"}
            </p>
            <p className="right-center-p">
              <span className="right-center-span">性别：</span>
              {(data.objectMainJson && data.objectMainJson.gender) || "-"}
            </p>
            <p className="right-center-p" title={data.taskName}>
              <span className="right-center-span">所在布控任务：</span>
              {data.taskName}
            </p>
            <p className="right-center-p">
              <span className="right-center-span">民族：</span>
              {(data.objectMainJson && data.objectMainJson.nationality) || "-"}
            </p>
            <p className="right-center-p" title={data.deviceName}>
              <span className="right-center-span">告警设备名称：</span>
              {data.deviceName || "-"}
            </p>
            <p className="right-center-p">
              <span className="right-center-span">身份证号：</span>
              {(data.objectMainJson && data.objectMainJson.identityNumber) ||
                "-"}
            </p>
            <p className="right-center-p" title={data.address}>
              <span className="right-center-span">告警设备地址：</span>
              {data.address || "-"}
            </p>
            <p className="right-center-p">
              <span className="right-center-span">出生年月：</span>
              {(data.objectMainJson && data.objectMainJson.birthday) || "-"}
            </p>
            <p className="right-center-p">
              <span className="right-center-span">告警时间：</span>
              {(data &&
                moment(+data.captureTime).format("YYYY.MM.DD HH:mm:ss")) ||
                "-"}
            </p>
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
