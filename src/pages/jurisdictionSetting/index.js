import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import * as _ from "lodash";
import enquire from "enquire.js/dist/enquire";

import FooterSubmit from "./components/Submit";

/**拖拽 */
import DragSourceView from "./components/DragSourceView";
import DropTargetView from "./components/DropTargetView";
import "./styles/index.less";
import { message } from "antd";

const IconFont = Loader.loadBaseComponent("IconFont");
const ChartCard = Loader.loadBusinessComponent('Statistics','ChartCard');
const BottomCharts = Loader.loadBusinessComponent('Statistics','BottomCharts')
const { MapComponent } = LMap;
const DragDropContextProvider = Loader.loadComponent(
  "ReactDnD",
  null,
  "DragDropContextProvider"
);
const Loading = Loader.Loading;

@withRouter
@inject("tab", "user")
@Decorator.withEntryLog()
@observer
class PanelView extends Component {
  /**
   * @param ids 6个选中选中框排序组合
   * @param isDrop 是否正在拖拽中
   */
  ResourceTotalList = Shared.getResourceTotalList()
  
  state = {
    ids: [],
    isDrop: false,
    isAnimation: false,
    spacing: 20,
    isActive: true,
    HTML5Backend: null
  };
  AMap = null;
  id = null;
  //初始化地图
  init = AMap => {
    let { userInfo } = this.props.user;
    let { centerPoint, zoomLevelCenter } = userInfo;
    this.AMap = AMap;
    this.AMap.setCenter(centerPoint && centerPoint.split(","));
    this.AMap.setZoom(zoomLevelCenter || 5);
  };
  componentWillMount() {
    let ids = this.props.location.search.split("=")[1];
    ids = ids ? ids.split(",") : [10, 2, 3, 1, 9, 6];
    Loader.loadScript("HTML5Backend",'default').then(fn => {
      this.setState({
        ids: ids.map(v => (v = parseInt(v, 10))),
        HTML5Backend: fn
      });
    });
  }
  componentWillUnmount() {
    this.AMap = null;
    this.fontSizeUnmount();
  }

  componentDidMount() {
    this.fontSizeInit();
  }
  //兼容分辨率
  setSpacing1920 = {
    match: () => this.setState({ spacing: 20 })
  };
  setSpacing1600 = {
    match: () => this.setState({ spacing: 15 })
  };
  setSpacing1366 = {
    match: () => this.setState({ spacing: 10 })
  };
  setSpacing1024 = {
    match: () => this.setState({ spacing: 6 })
  };

  //兼容分辨率
  fontSizeInit = () => {
    enquire
      .register(
        "screen and (max-width:1921px) and (min-width:1601px)",
        this.setSpacing1920
      )
      .register(
        "screen and (max-width:1601px) and (min-width:1441px)",
        this.setSpacing1600
      )
      .register(
        "screen and (max-width:1441px) and (min-width:1025px)",
        this.setSpacing1366
      )
      .register("screen and (max-width:1025px)", this.setSpacing1024);
  };

  fontSizeUnmount = () => {
    enquire
      .unregister(
        "screen and (max-width:1921px) and (min-width:1601px)",
        this.setSpacing1920
      )
      .unregister(
        "screen and (max-width:1601px) and (min-width:1441px)",
        this.setSpacing1600
      )
      .unregister(
        "screen and (max-width:1441px) and (min-width:1025px)",
        this.setSpacing1366
      )
      .unregister("screen and (max-width:1025px)", this.setSpacing1024);
    this.setSpacing1920 = null;
    this.setSpacing1600 = null;
    this.setSpacing1366 = null;
    this.setSpacing1024 = null;
  };
  /**
   * 开始拖拽,记录当前拖拽id
   */
  beginDrag = id => {
    this.id = id;
    this.setState({
      isDrop: true
    });
  };
  /**
   * 结束拖拽
   */
  endDrag = id => {
    this.id = null;
    this.setState({
      isDrop: false
    });
  };
  /**
   * 放下事件
   * @param props 拖拽组件内容
   * @param id 被拖拽组件id
   * @param targetId 被拖入的id
   */
  onDrop = id => {
    let { ids } = this.state;
    id = parseInt(id, 10);
    ids[id] = this.id;
    this.setState({
      ids,
      isDrop: false
    });
  };
  //渲染cards
  renderCards = t => {
    const { ids } = this.state;
    let left = ids.slice(0, 3);
    let right = ids.slice(3, 6);
    return (t === "left" ? left : right).map((v, i) => {
      const Module = this.ResourceTotalList.filter(m => m.id === v)[0];
      return Module ? (
        <DropTargetView
          key={`${t}${i}`}
          onDrop={this.onDrop}
          id={Module.id}
          dropId={this.id}
          current={t === "left" ? i : i + 3}
        >
          <div className="camera-numb-wrapper">
            <ChartCard title={Module.title} type={"charts"} name={`${t}${i}`}>
              {Module.component && <Module.component />}
            </ChartCard>
          </div>
        </DropTargetView>
      ) : (
        <DropTargetView
          key={`${t}${i}`}
          onDrop={this.onDrop}
          id={0}
          dropId={this.id}
          current={t === "left" ? i : i + 3}
        >
          <div className="camera-numb-wrapper">
            <ChartCard
              title={""}
              type={"charts"}
              key={`${t}${i}p`}
              name={`${t}${i}`}
            >
              {
                <div style={{ margin: "20px auto", textAlign: "center" }}>
                  此模块暂时移除，请重新编辑面板
                </div>
              }
            </ChartCard>
          </div>
        </DropTargetView>
      );
    });
  };
  //渲染Cards模块
  renderCardsDom = () => {
    return (
      <React.Fragment>
        <div className="home-left">{this.renderCards("left")}</div>
        <div className="home-right">{this.renderCards("right")}</div>
      </React.Fragment>
    );
  };
  /**保存 */
  submit = () => {
    Service.kvStore
      .setUserKvStore({userId:this.props.user.userInfo.id,
          storeKey:"PANELSETTING",
          storeValue:this.state.ids})
      .then((res) => {
        message.success('设置成功')
        SocketEmitter.emit(SocketEmitter.eventName.panelEdit, this.state.ids);
        this.cancel();
      });
  };
  /**取消 */
  cancel = () => {
    const { tab, location } = this.props;
    if (tab.tabList.length > 1) {
      tab.closeCurrentTab({action:'push'});
    } else {
      tab.goPage({
        moduleName: "JurisdictionOverview",
        location,
        isUpdate: true
      });
    }
  };
  //
  checkout = () => {
    this.setState({ isAnimation: !this.state.isAnimation });
  };
  /**鼠标横向滚动 */
  scroll = e => {
    if (!this.isScroll) {
      this.isScroll = true;

      const oldScrollLeft = this.srcollTemplete.scrollLeft;
      const newScrollLeft = oldScrollLeft + e.deltaY * 2;
      this.srcollTemplete.scrollLeft = newScrollLeft;

      setTimeout(() => (this.isScroll = false), 100);
    }
  };
  //---卡片自适应 结束-----
  render() {
    let { isDrop, isAnimation, spacing, HTML5Backend } = this.state;
    if (!HTML5Backend) {
      return <Loading />;
    }
    return (
      <React.Fragment>
        <DragDropContextProvider backend={HTML5Backend}>
          <div
            className={`home-main home-mains ${this.state.isDrop &&
              "home-main-droping"}`}
          >
            {/* <Title
						total={0}
					/> */}
            <div className="home-bg">
              <MapComponent initMap={this.init} centerIsCity={true} />
            </div>
            {this.renderCardsDom()}
            <div className={`home-bottom ${isDrop && "home-bottom-gray"}`}>
              {/* <div className='home-bottom home-bottom-gray'> */}
              <BottomCharts dayResouecesStatis={0} deviceStateStatis={0} />
            </div>
            <span
              onClick={() => this.checkout()}
              className="upDown"
              style={{
                animation:
                  isDrop || isAnimation
                    ? "ons 300ms 1 ease-in-out forwards"
                    : "offs 300ms 1 ease-in-out forwards"
              }}
            >
              <IconFont
                type={
                  isDrop || isAnimation
                    ? "icon-Arrow_Big_Down_Main"
                    : "icon-Arrow_Big_Up_Main"
                }
              />
            </span>
            <div
              className="templete-wrapper"
              style={{
                animation:
                  isDrop || isAnimation
                    ? "on 300ms 1 ease-in-out forwards"
                    : "off 300ms 1 ease-in-out forwards"
              }}
            >
              <div
                className="templete-wrapper-content"
                onWheel={this.scroll}
                ref={ref => (this.srcollTemplete = ref)}
              >
                <div className="container">
                  {this.ResourceTotalList &&
                    this.ResourceTotalList.map(module => {
                      let Item = module.component ? module.component : null;
                      return (
                        <DragSourceView
                          key={module.id}
                          isAllowDrap={this.state.ids.indexOf(module.id) === -1}
                          beginDrag={() => this.beginDrag(module.id)}
                          endDrag={() => this.endDrag(module.id)}
                          title={module.title}
                          id={module.id}
                        >
                          {Item && <Item />}
                        </DragSourceView>
                      );
                    })}
                </div>
              </div>
            </div>
            <FooterSubmit submit={this.submit} cancel={this.cancel} />
          </div>
        </DragDropContextProvider>
        <style jsx="true">{`
						.home-left,
						.home-right {
							transform: scale(${
                spacing >= 20 ? "1,1" : spacing >= 10 ? ".7,.7" : ".60,.60"
              });
						}
						.templete-wrapper{
							transform: translate(-50%,0) scale(${
                spacing >= 20 ? "1,1" : spacing >= 10 ? ".7,.7" : ".60,.60"
              });
							width:calc(${
                spacing >= 20
                  ? "100% - 0px"
                  : spacing >= 10
                  ? "100% + 560px"
                  : "100% + 650px"
              })!important;
						}
						.home-left{
							// top:${spacing >= 20 ? 50 : spacing >= 10 ? 0 : 50}px!important;
							height:calc(${
                spacing === 20
                  ? "100% - 0px"
                  : spacing === 10
                  ? "100% + 260px"
                  : spacing === 15
                  ? "100% + 96px"
                  : "100% + 196px"
              })!important;
							left:${spacing >= 20 ? "0" : spacing >= 10 ? "-40" : "-50"}px;
						}
						.home-right{
							// top:${spacing >= 20 ? 0 : spacing >= 10 ? 0 : 50}px!important;
							height:calc(${
                spacing === 20
                  ? "100% - 0px"
                  : spacing === 10
                  ? "100% + 260px"
                  : spacing === 15
                  ? "100% + 96px"
                  : "100% + 196px"
              })!important;
							right:${spacing >= 20 ? "0" : spacing >= 10 ? "-40" : "-50"}px;
						}
						.home-bottom{
							transform:scale(${spacing >= 20 ? "1,1" : spacing >= 10 ? ".7,.7" : ".60,.60"});
							width:calc(${
                spacing >= 20
                  ? "100% - 600px"
                  : spacing >= 10
                  ? "100% - 80px"
                  : "100% - 650px"
              })!important;
							left:${spacing >= 20 ? 300 : spacing >= 10 ? 40 : 300}px!important;
							height:${spacing >= 20 ? 230 : spacing >= 10 ? 200 : 200}px!important;
						}
						.submit-container{
							bottom:${spacing >= 20 ? 255 : spacing >= 10 ? 155 : 200}px!important;
						}
					.templete-wrapper {
    				top:0;
					}
					.upDown{
						height: ${isDrop || isAnimation ? 24 : 26}px;
						padding-top:  ${isDrop || isAnimation ? 0 : 5}px;
					}
					@keyframes ons {
						from {
							top: ${spacing >= 20 ? "320px" : spacing >= 10 ? "217px" : "220px"};
						}
						to {
							top: -4px;
						}
					}
					@keyframes offs {
						from {
							top: -4px;
						}
						to {
							top: ${spacing >= 20 ? "320px" : spacing >= 10 ? "217px" : "220px"};
						}
					}
					@keyframes on {
						from {
							opacity: 1;
							top: 0;
							z-index:15;
						}
						to {
							opacity: 0;
							top: -350px;
							z-index:4;
						}
					}
					@keyframes off {
						from {
							opacity: 0;
							top: -350px;
							z-index:4;
						}
						to {
							opacity: 1;
							top: 0;
							z-index:15;
						}
					}
					.camera-numb, .no-drop{
						box-shadow:0px 0px 0px rgba(0, 0, 0, 0.2);
					}
				`}</style>
      </React.Fragment>
    );
  }
}

export default PanelView;
