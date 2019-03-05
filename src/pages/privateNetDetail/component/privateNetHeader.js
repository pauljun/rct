import React from "react";
import { Progress, Input, Button } from "antd";
import moment from "moment";
import "./privateNetHeader.less";
const { TextArea } = Input;
const ImageView = Loader.loadBusinessComponent("ImageView");
const IconFont = Loader.loadBaseComponent("IconFont");

class privateNetHeader extends React.Component {
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
    return (
      <div className="private-header">
        <div className="private-left">
          <div className="left-img">
            <div className="detailed-Cloth">
              <div className="cloth-img">
                <ImageView src={data.faceUrl} />
              </div>
              <p className="cloth-p">抓拍照片</p>
            </div>
          </div>
        </div>
        <div className="private-right">
          <div className="message-left">
            <p className="right-center-p process">
              <span className="right-center-span"> 相似度：</span>
              <div className="process-box">
                <Progress
                  percent={data.score && Math.floor(data.score)}
                  status="active"
                  strokeWidth={4}
                />
              </div>
            </p>
            <p className="right-center-p" title="-">
              <span className="right-center-span"> 互联网别名：</span>-
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
          <div className="message-left">
            <p className="right-center-p" title={data.libName}>
              <span className="right-center-span"> 所在布控库：</span>
              {data.libName || "-"}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default privateNetHeader;
