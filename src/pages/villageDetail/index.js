import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import BaseInfo from "./components/BaseInfo";
import "./style/edit.less";

const WrapperView = Loader.loadBusinessComponent("SystemWrapper");

@Decorator.errorBoundary
@withRouter
@observer
class VillageDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      initData: {},
      villageDevices: []
    };
    let { location } = props;
    this.isAdd = Utils.queryFormat(location.search).isAdd === "true";
    this.activeId = this.isAdd ? "" : Utils.queryFormat(location.search).id;
    SocketEmitter.on(
      SocketEmitter.eventName.updateVillageDevices,
      this.initDatas
    );
  }
  componentWillUnmount() {
    SocketEmitter.off(SocketEmitter.eventName.updateVillageDevices);
    this.isAdd = null;
    this.activeId = null;
  }
  //初始化数据
  initDatas = () => {
    Service.community.villageDetail({ id: this.activeId }).then(res => {
      this.setState({
        initData: res.data
      });
    });
  };
  componentWillMount() {
    !this.isAdd && this.initDatas();
    this.setState({ loading: false });
  }
  render() {
    let { initData, loading } = this.state;
    return (
      <WrapperView name={initData.villageName} width={"100%"}>
        <div className="edit-village-waper">
          {!loading && (
            <div className="wappers">
              <BaseInfo
                key="baseInfo"
                isAdd={this.isAdd}
                initData={initData}
                activeId={this.activeId}
              />
            </div>
          )}
        </div>
      </WrapperView>
    );
  }
}
export default VillageDetail;
