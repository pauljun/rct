import React from "react";

import "./index.less";

const IconFont = Loader.loadBaseComponent("IconFont");
const CaptureCard = Loader.loadBusinessComponent("Card", "CaptureCard");

class ForeignCard extends React.Component {
  constructor(props) {
    super(props);
  }
  handleJumPage = (id, alarmType) => {
    this.props.handleJumPage && this.props.handleJumPage(id, alarmType);
  };

  render() {
    const { data = {}, isActual, handleChangeYN,score } = this.props;
    let {
      isEffective,
      faceUrl,
      captureTime,
      alarmType,
      isHandle,
      taskName,
      deviceName,
      id
    } = data;
    return (
      <CaptureCard
        className="foreign-card"
        onClick={() => this.handleJumPage(id, alarmType)}
        score={score}
        imgHasHover={false}
        imgUrl={faceUrl}
        relativeIcon={''}
        captureTime={captureTime}
        deviceName={deviceName}
      >
        <div className="item">
          <IconFont type={"icon-Layer_Main"} theme="outlined" />
          <span className="content-value" title={taskName}>
            {taskName}
          </span>
        </div>
        {!isActual && isHandle == 0 && (
          <div className="card-footer">
            <div
              className="handle handle-no"
              onClick={handleChangeYN && handleChangeYN.bind(this, data, 0)}
            >
              <IconFont type={"icon-YesNo_No_Main"} theme="outlined" />
              无效
            </div>
            <div
              className="handle handle-yes"
              onClick={handleChangeYN && handleChangeYN.bind(this, data, 1)}
            >
              <IconFont type={"icon-YesNo_Yes_Main"} theme="outlined" />
              有效
            </div>
          </div>
        )}
        {!isActual && isHandle == 1 && (
          <div
            className={`alam-rotate ${
              isEffective == 1 ? "alarm-rotate-yes" : "alarm-rotate-no"
            }`}
          />
        )}
      </CaptureCard>
    );
  }
}

export default ForeignCard;
