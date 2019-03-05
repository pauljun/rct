import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { Spin, message } from "antd";
import "./index.less";
// 加载基础组价
const LibList = Loader.loadBusinessComponent("MonitorLibrary", "LibList");
const LibDetail = Loader.loadBusinessComponent("MonitorLibrary", "LibDetail");
const LibPeople = Loader.loadBusinessComponent("MonitorLibrary", "LibPeople");
const FormLibInfo = Loader.loadBusinessComponent("MonitorLibrary","FormLibInfo");
const LocalPeopleView = Loader.loadBusinessComponent("MonitorLibrary","LocalPeopleView");
const MonitorNavigation = Loader.loadBusinessComponent("MonitorNavigation");
const ModalComponent = Loader.loadBaseComponent("ConfirmComponent");
const NoData = Loader.NoData;

@withRouter
@Decorator.withEntryLog()
@Decorator.businessProvider("monitorLib", "tab", "user")
@observer
class KeyPersonnelLibraryView extends React.Component {
  constructor(props) {
    super(props);
    const libTypeInfo = {
      libType: 1,
      libLabel: "重点人员",
      authAction: "keyPersonnelLibraryManage",
      moduleName: "keyPersonnelLibraryView"
    };
    this.libTypeInfo = libTypeInfo;
    this.libType = libTypeInfo.libType;
    this.libLabel = libTypeInfo.libLabel;
    this.userId = BaseStore.user.userInfo.id;
    this.state = {
      content: 2, // 组件，2. 编辑库信息, 3本地添加，6: 编辑一体机库, 7：删除布控库
      contentOptions: {}, // 组件参数
      loading: false,
      peopleId: "",
      headerLoading: false,
      modalVisible: false,
      //数据迁移，将mobx数据迁移到当前state
      libList: [], // 布控库列表
      currLibId: "", // 当前选中布控库的id
      libDetail: {} /**选中的布控库的详情 */,
      spinningTip: "",
      spinning: false
    };
  }
  componentWillMount() {
    const { monitorLib } = this.props;
    monitorLib.initData({ libType: this.libType });
  }
  componentDidMount() {
    this.libImportUpdate();
  }
  componentWillUnmount() {
    this.libTypeInfo = null;
    this.libType = null;
    this.libLabel = null;
  }
  libImportUpdate = () => {
    const {
      location: { state }
    } = this.props;
    let libId;
    if (state && state.pageState) {
      libId = state.pageState.libId;
    }
    this.getLibList(libId);
  };

  // 获取组件
  getContent = content => {
    const { libDetail, peopleId, contentOptions,loading } = this.state;
    const libType = this.libType;
    let children,
      title,
      onOk,
      modalOptions = {}; // 弹窗额外参数
    let onCancel = this.setModalVisible;
    switch (content) {
      case 2: // 编辑布控库信息
        modalOptions.width = "998px";
        title = `编辑${this.libLabel}库详情`;
        // libInfo需要带libType字段
        let libInfo = JSON.parse(JSON.stringify(libDetail))
        libInfo.libDetail = 1
        onOk = () => this.submitLibInfo(libDetail.id);
        children = (
          <FormLibInfo
            libInfo={libInfo}
            viewRef={view => (this.libInfoView = view)}
          />
        );
        break;
      case 3: // 编辑布控人员
        title = `编辑${this.libLabel}：${contentOptions.peopleName}`;
        onOk = this.submitPeople;
        modalOptions.width = "800px";
        children = (
          <LocalPeopleView
            className="monitee-people-wrapper"
            viewRef={localView => (this.localView = localView)}
            libType={libType}
            peopleId={peopleId}
            setSpinning={this.setSpinning}
            libDetail={libDetail}
          />
        );
        break;
      case 7: // 删除布控库
        if (!contentOptions.personCount || contentOptions.personCount == 0) {
          modalOptions.width = "320px";
          modalOptions.img = "delete";
          title = "删除确认";
          onOk = this.deleteLib;
          modalOptions.confirmLoading=loading;
          children = (
            <div className="lib-delete-content">
              <p>
                确定要删除{" "}
                <span className="highlight"> {contentOptions.name} </span> ？
              </p>
            </div>
          );
        } else {
          modalOptions.width = "320px";
          modalOptions.img = "warning";
          title = "提示";
          onOk = this.setModalVisible;
          modalOptions.confirmLoading=loading;
          children = (
            <div className="lib-delete-content">
              <p>
                <span className="highlight">{contentOptions.name}</span> 中还有
                <span className="highlight">
                  {contentOptions.personCount}
                </span>{" "}
                名{this.libLabel}
              </p>
              <p>请先清空{this.libLabel}在删除本库</p>
            </div>
          );
        }
        break;
      case 8: // 删除布控人员
        modalOptions.width = "320px";
        modalOptions.img = "delete";
        title = "删除确认";
        onOk = this.deletePeopleBatch;
        modalOptions.confirmLoading=loading;
        children = (
          <div className="lib-delete-content">
            <p>确定要删除选定人员 ？</p>
          </div>
        );
        break;
      default:
        break;
    }
    return {
      title,
      onOk,
      onCancel,
      children,
      ...modalOptions
    };
  };

  // 设置弹窗显示状态和子组件
  setContent = ({ content = 0, modalVisible = true, ...contentOptions }) => {
    this.setState({
      content,
      modalVisible,
      contentOptions
    });
  };
  // 设置弹窗显示状态
  setModalVisible = (modalVisible = false) => {
    this.setState({
      modalVisible
    });
  };
  // 设置确认按钮loading
  setConfirmLoading = (confirmLoading = true) => {
    const { contentOptions } = this.state;
    if (contentOptions.confirmLoading !== confirmLoading) {
      contentOptions.confirmLoading = confirmLoading;
      this.setState({
        contentOptions
      });
    }
  };
  setSpinning = (spinning = true, spinningTip = "") => {
    this.setState({
      spinning,
      spinningTip
    });
  };

  // --------------  布控库操作 ------------------
  // 删除布控库
  deleteLib = () => {
    const { id, name } = this.state.contentOptions;
    this.setState({ loading: true });
    this.asyncDeleteLib({
      id,
      libType: this.libType,
      libName: name
    }).then(result => {
      if (result) {
        message.success("删除成功");
        const { libList, libInfo } = result;
        this.setState({
          libList,
          currLibId: libInfo.currLibId,
          libDetail: libInfo.libDetail || {},
          modalVisible: false,
          loading: false
        });
      }
    }).catch(err => {
      message.error(err.data.message)
      this.setState({
        modalVisible: false,
        loading: false
      });
    })
  };
  /**
   * @desc 删除数据库布控库
   * @param {string} id 布控库id
   */
  asyncDeleteLib({ id, updateList = true, libType, libName }) {
    return Service.monitorLib.deleteMonitorLib({ id, libType, libName }).then(result => {
      if (result.code !== 200000) {
        return false;
      }
      if (updateList) {
        return this.getAsyncLibList(null);
      }
      return result;
    });
  }

  /**
   * @desc 编辑布控库表单信息
   */
  submitLibInfo = id => {
    this.libInfoView.onSubmit(libInfo => {
      libInfo.id = id;
      this.setConfirmLoading();
      Service.monitorLib.updateMonitorLib(libInfo).then(result => {
        if (result.code === 200000) {
          message.success("修改成功");
          this.updateLibDetail(id);
        } else {
          this.setConfirmLoading(false);
        }
      });
    });
  };
  // --------------  布控人员操作 ------------------
  // 编辑布控人员弹窗
  editLibPeople = item => {
    this.peopleView = "localView";
    this.setState({
      peopleId: item.id
    });
    this.setContent({
      content: 3,
      peopleName: item.selfAttr.name
    });
  };
  // 删除布控人员
  setDeleteLibPeopleContent = (peopleIds, libId, callback) => {
    this.setState({ loading: true });
    this.setContent({
      content: 8,
      peopleIds,
      libId,
      callback
    });
    return Promise.resolve().then(() => this.setState({ loading: false }));
  };
  
  /**
   * @desc 批量删除布控人员
   */
  deletePeopleBatch = () => {
    this.setState({ loading: true });
    const { libDetail, contentOptions } = this.state;
    const { peopleIds, libId, callback } = contentOptions;
    return Service.monitorLib
      .deleteMonitorLibPersons(peopleIds, libDetail)
      .then(res => {
        if (res.code === 200000) {
          message.success("删除成功");
          this.setState({ loading: false });
          callback && callback();
          this.updateLibDetail(libId);
        } else {
          this.setModalVisible();
        }
      });
  };
  beforeUpload = peopleView => {
    this.peopleView = peopleView;
  };
  // 上传布控人员
  submitPeople = peopleList => {
    // 1. 提交人员信息
    this[this.peopleView]["onSubmit"](peopleList, libId => {
      message.success("上传成功");
      // 2. 更新布控库详情
      this.updateLibDetail(libId);
      // 本地添加时，清空peopleId
      this.peopleView === "localView" && this.setState({ peopleId: "" });
    });
  };
  // 取消添加布控人员
  cancelPeople = () => {
    // 1. 取消人员信息
    this[this.peopleView]["onCancel"](() => {
      // 2. 跳转列表页
      this.setContent({});
      // 本地添加时，清空peopleId
      this.peopleView === "localView" && this.setState({ peopleId: "" });
    });
  };

  /**
   * @desc 根据布控库名称查询布控库
   * @param {string} name 布控库名称
   */
  handleSearchLib = name => {
    const { monitorLib } = this.props;
    monitorLib.editSearchData({ name }).then(this.getLibList);
  };

  /**
   * @desc 查询布控库列表
   * @param {string} name
   */
  getLibList = libId => {
    this.getAsyncLibList(libId).then(result => {
      if (result) {
        const { libList, libInfo } = result;
        this.setState({
          libList,
          currLibId: libInfo.currLibId,
          libDetail: libInfo.libDetail || {}
        });
      }
    });
  };
  /**
   * @desc 获取布控库详情
   * @param {string} id 布控库id
   */
  getLibDetail = id => {
    if (id !== this.state.currLibId) {
      const funcName = "getAsyncLibDetail";
      this[funcName](id).then(res => {
        this.setState({
          currLibId: res.currLibId,
          libDetail: res.libDetail
        });
      });
    }
  };
  /**
   * @desc 更新布控库信息并返回列表页
   * @param {string} libId 布控库id
   */
  updateLibDetail = (libId, hideModal = true) => {
    this.getAsyncLibDetail(libId).then(res => {
      //本地更新左侧数据列表
      let { libList } = this.state;
      const libItem = libList.find(v => v.id === res.currLibId);
      libItem.name = res.libDetail.name;
      libItem.personCount =
        res.libDetail.objectMainList && res.libDetail.objectMainList.length;
      this.setState({
        currLibId: res.currLibId,
        libDetail: res.libDetail,
        libList
      });
    });
    hideModal && this.setModalVisible();
  };

  /**
   * @desc 获取远程布控库列表
   * @param {string} libId 布控库id
   */
  getAsyncLibList = libId => {
    const { currLibId } = this.state;
    const { monitorLib } = this.props;
    return Service.monitorLib
      .queryMonitorLibs(monitorLib.searchData)
      .then(async result => {
        if (!result.data) {
          return false;
        }
        const libList = result.data.list || []; // 布控库列表
        let libInfo = {};
        if (libList.length) {
          // libId不存在或libId===当前libId时取列表第一个
          const newLibId =
            !libId || libId === currLibId ? libList[0].id : libId;
          libInfo = await this.getAsyncLibDetail(newLibId);
        }
        return {
          libList,
          libInfo
        };
      });
  };
  /**
   * @desc 获取数据库布控库详情
   * @param {string} id 布控库id
   */
  getAsyncLibDetail(id) {
    return Service.monitorLib.queryMonitorLibDetail(id).then(result => {
      let libDetail = result.data || {}
      const libInfo = {
        currLibId: id
      };
      libDetail.objectMainList.map(v => {
          v.infoList = libDetail.objectInfoList.filter(
            x => x.objectId === v.id
          );
          v.errPicCount = v.infoList.filter(x => x.saveStatus !== "0").length;
      });
      // if (Array.isArray(libDetail.objectMainList)) {// 兼容后台无字段情况
      //   libDetail.objectMainList.map(v => {
      //     if(Array.isArray(libDetail.objectInfoList)){// 兼容后台无字段情况
      //       v.infoList = libDetail.objectInfoList.filter(
      //         x => x.objectId === v.id
      //       );
      //       v.errPicCount = v.infoList.filter(x => x.saveStatus !== "0").length;
      //     }else{
      //       v.infoList = []
      //       v.errPicCount = 0
      //     }
      //   });
      // }
      libInfo.libDetail = libDetail;
      return libInfo;
    });
  }

  render() {
    const {
      content,
      libDetail,
      libList,
      currLibId,
      modalVisible,
      spinning,
      spinningTip
    } = this.state;
    let modalOptions;
    if (modalVisible) {
      modalOptions = this.getContent(content);
    }
    return (
      <MonitorNavigation
        libType={this.libTypeInfo.libType}
        currentMenu={this.libTypeInfo.moduleName}
        contentClass="monitee-lib-wrapper monitee-black-lib-wrapper"
      >
        <LibList
          className="monitor-content-aside"
          libTypeInfo={this.libTypeInfo}
          listData={libList}
          userId={this.userId}
          currLibId={currLibId}
          onSearch={this.handleSearchLib}
          deleteLib={(id, name, personCount) =>
            this.setContent({ content: 7, id, name, personCount })
          }
          getLibDetail={this.getLibDetail}
        />
        <div className="monitor-content-wrapper monitee-black-content-wrapper">
          {!!libList.length ? (
            <div className="monitee-black-lib-detail-wrapper">
              <React.Fragment>
                <LibDetail
                  libTypeInfo={this.libTypeInfo}
                  userId={this.userId}
                  libDetail={libDetail}
                  onEdit={() =>
                    this.setContent({ content: 2, id: libDetail.id })
                  }
                />
                <LibPeople
                  userId={this.userId}
                  libTypeInfo={this.libTypeInfo}
                  setSpinning={this.setSpinning}
                  libDetail={libDetail}
                  viewRef={multiView => (this.multiView = multiView)}
                  deleteCheckable
                  beforeUpload={this.beforeUpload}
                  uploadDone={this.submitPeople}
                  deleteLibPeople={(item, libId, callback) =>
                    this.setDeleteLibPeopleContent([item.id], libId, callback)
                  }
                  editLibPeople={this.editLibPeople}
                  deletePeopleBatch={this.setDeleteLibPeopleContent}
                  actionName='keyPersonnelLibraryManage'
                />
              </React.Fragment>
            </div>
          ) : (
            <NoData title={`暂无${this.libTypeInfo.libLabel}库信息`} />
          )}
        </div>
        <ModalComponent
          className={`monitee-lib-modal 
            ${content === 3 ? "edit-people-model" : ""} 
          `}
          visible={modalVisible}
          {...modalOptions}
        />
        {spinning && (
          <Spin
            size="large"
            className="monitor-spin-content"
            wrapperClassName="monitor-spin-wrapper"
            tip={spinningTip}
            spinning={true}
          >
            <div />
          </Spin>
        )}
      </MonitorNavigation>
    );
  }
}

export default KeyPersonnelLibraryView;
