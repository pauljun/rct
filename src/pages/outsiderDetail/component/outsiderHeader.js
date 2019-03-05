import React from "react";
import { Progress, Input, Button } from "antd";
import moment from "moment";
import "./outsiderHeader.less";
const { TextArea } = Input;
const ImageView = Loader.loadBusinessComponent("ImageView");
const IconFont = Loader.loadBaseComponent("IconFont");
const AuthComponent = Loader.loadBusinessComponent("AuthComponent");

@Decorator.businessProvider("menu")
class OutsiderHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkType: false
    };
    this.logType = [
      { key: 1, value: "黑名单报警" },
      { key: 2, value: "白名单报警" },
      { key: 3, value: "事件报警" },
      { key: 4, value: "白名单比对记录" },
      { key: 5, value: "一体机黑名单报警" },
      { key: 6, value: "APP临时任务报警" }
    ];
  }
  componentDidMount() {
    const { menu } = this.props;
    const action = menu.getInfoByName("outsiderLibraryView");
    if (action) {
      this.setState({
        checkType: true
      });
    }
  }

  goLibDetail = id => {
    if (this.state.checkType) {
      this.props.goLibDetail(id);
    } else {
      return;
    }
  };

  render() {
    let {
      data = {},
      handleText,
      operationDetail,
      handleOpenModal,
      libList
    } = this.props;
    data.logType = 2;
    return (
      <div className="outsider-header">
        <div className="outsider-left">
          <div className="left-img">
            <div className="detailed-Cloth">
              <div className="cloth-img">
                <ImageView src={data.faceUrl} />
              </div>
              <p className="cloth-p">抓拍照片</p>
            </div>
          </div>
        </div>
        <div className="outsider-right">
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
                <AuthComponent actionName="outsiderHistory">
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
                <span className="right-center-span "> 所在布控任务：</span>
                <span className="task-name">{data.taskName || "-"}</span>
              </p>
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
            <div className="center-lib">
              <div className="center-lib-title">合规人员库：</div>
              <div className="center-lib-box">
                {libList.length > 0
                  ? libList.map(v => {
                      return (
                        <div className="btn-box" key={v.libId}>
                          <AuthComponent
                            actionName="outsiderLibraryView"
                            noAuthContent={
                              <span className="btn-box-span">{v.libName}</span>
                            }
                          >
                            <span
                              className="btn-box-span"
                              title={v.libName}
                              onClick={() => this.goLibDetail(v.libId)}
                            >
                              {v.libName}
                            </span>
                          </AuthComponent>
                        </div>
                      );
                    })
                  : "-"}
              </div>
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

export default OutsiderHeader;
