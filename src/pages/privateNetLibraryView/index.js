import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { message, Spin } from "antd";
import MachineDetail from "./components/MachineDetail";
import MachineInfo from "./components/MachineDetail/machineInfo";
import UploadMachineLib from "./components/UploadMachineLib";
import "./index.less";
// 加载基础组价
const MonitorNavigation = Loader.loadBusinessComponent("MonitorNavigation");
const ModalComponent = Loader.loadBaseComponent("ConfirmComponent");
const LibList = Loader.loadBusinessComponent("MonitorLibrary", "LibList");
const NoData = Loader.NoData;
@withRouter
@Decorator.withEntryLog()
@Decorator.businessProvider("monitorLib", "tab", "user")
@observer
class privateNetLibraryView extends React.Component {
  constructor(props) {
    super(props);
    const libTypeInfo = {
      libType: 4,
      libLabel: "专网",
      authAction: "privateNetLibraryManage",
      moduleName: "privateNetLibraryView"
    };
    this.libTypeInfo = libTypeInfo;
    this.libType = libTypeInfo.libType;
    this.libLabel = libTypeInfo.libLabel;
    this.userId = BaseStore.user.userInfo.id;
    this.state = {
      content: 6, //6: 编辑一体机库, 7：删除布控库
      contentOptions: {}, // 组件参数
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
    SocketEmitter.on("importLib", this.libImportUpdate);
  }
  componentWillUnmount() {
    this.libTypeInfo = null;
    this.libType = null;
    this.libLabel = null;
    SocketEmitter.off("importLib", this.libImportUpdate);
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
    const { libDetail } = this.state;
    let children,
      title,
      onOk,
      modalOptions = {}; // 弹窗额外参数
    let onCancel = this.setModalVisible;
    switch (content) {
      case 6: // 编辑一体机布控库
        modalOptions.width = "800px";
        title = "编辑专网库详情";
        onOk = this.submitMachineInfo;
        children = (
          <MachineInfo
            isEdit
            libDetail={libDetail}
            viewRef={view => (this.machineView = view)}
          />
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
  // --------------  布控库操作 ------------------
  // 编辑一体机
  submitMachineInfo = () => {
    const { libDetail } = this.state;
    this.machineView.onSubmit().then(obj => {
      let description = obj.description;
      if (obj.errorShow) {
        return message.error("表单验证失败");
      }
      Service.monitorLib
        .updateMonitorLib({
          description,
          id: libDetail.id,
          libType: 4,
          name: libDetail.name
        })
        .then(res => {
          if (res.code === 200000) {
            message.success('专网库修改成功!')
            const newLib = Object.assign({}, libDetail, { description });
            this.setState({
              libDetail: newLib,
              modalVisible: false
            });
          }
        });
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
   * @desc 获取远程布控库列表
   * @param {string} libId 布控库id
   */
  getAsyncLibList = libId => {
    const { currLibId } = this.state;
    const { monitorLib } = this.props;
    return Service.monitorLib
      .queryMonitorLibs(monitorLib.searchData)
      .then(async result => {
        if (!result.code === 200000) {
          return false;
        }
        const libList = result.data.list || []; // 布控库列表
        let libInfo = {};
        if (libList.length) {
          // libId不存在或libId===当前libId时取列表第一个
          const newLibId =
            !libId || libId === currLibId ? libList[0].id : libId;
          if(newLibId){
            libInfo = await this.getAsyncMachineDetail(newLibId)
          }
        }
        return {
          libList,
          libInfo
        };
      });
  };
  
  /**
   * @desc 获取布控库详情
   * @param {string} id 布控库id
   */
  getLibDetail = id => {
    if (id !== this.state.currLibId) {
      this.getAsyncMachineDetail(id).then(res => {
        this.setState({
          currLibId: res.currLibId,
          libDetail: res.libDetail
        });
      });
    }
  };

  /**
   * @desc 获取数据库一体机布控库详情
   * @param {string} id 布控库id
   */
  getAsyncMachineDetail(id) {
    return Service.monitorLib.queryMonitorLibDetail(id).then(libDetail => {
      const libInfo = {
        libDetail: libDetail ? libDetail.data : {},
        currLibId: id
      };
      return libInfo;
    }).catch(err => {
      message.error('布控库详情查询失败')
      return {
        libDetail: {}
      }
    })
  }

  /**
   * @desc 获取数据库一体机布控库详情
   * @param {string} id 布控库id
   */
  asyncDeleteLib({ id, updateList = true, libType, libName }) {
    return Service.monitorLib.deleteMonitorLib({ id, libType, libName }).then(result => {
      if (!result) {
        return false;
      }
      if (updateList) {
        return this.getAsyncLibList(null);
      }
      return result;
    });
  }
  getUploadMachineLib=() => {
    return <UploadMachineLib />
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
        libType={this.libType}
        currentMenu={this.libTypeInfo.moduleName}
        contentClass="monitee-lib-wrapper monitee-black-lib-wrapper"
      >
        <LibList
          className="monitor-content-aside"
          libTypeInfo={this.libTypeInfo}
          libType={this.libType}
          listData={libList}
          userId={this.userId}
          currLibId={currLibId}
          onSearch={this.handleSearchLib}
          getLibDetail={this.getLibDetail}
          getUploadMachineLib={this.getUploadMachineLib}
        />
        <div className="monitor-content-wrapper monitee-black-content-wrapper">
          {!!libList.length ? (
            <div className="monitee-black-lib-detail-wrapper">
              <MachineDetail
                actionName='privateNetLibraryManage'
                onEdit={() => this.setContent({ content: 6, id: libDetail.id })}
              >
                <MachineInfo libDetail={libDetail} />
              </MachineDetail>
            </div>
          ) : (
            <NoData title={`暂无${this.libTypeInfo.libLabel}库信息`} />
          )}
        </div>
        <ModalComponent
          className={`monitee-lib-modal 
            ${content === 6 ? "edit-machine-model" : ""}
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

export default privateNetLibraryView;
