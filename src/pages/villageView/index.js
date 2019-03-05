import React from "react";
import { observer } from "mobx-react";
import Search from "./components/Search";
import Table from "./components/Table";
import { message,Modal } from "antd";
import './style/index.less';

const WrapperView = Loader.loadBusinessComponent("SystemWrapper");
const confirm = Modal.confirm;

@Decorator.businessProvider("village", "tab", "organization")
@Decorator.withEntryLog()
@observer
class VillageListView extends React.Component {
  state = {
    list: [],
    total: 10,
    loading: false,
    visible: false,
    currentVillage: {},
    key: Math.random()
  };

  componentWillUnmount() {
    SocketEmitter.off(SocketEmitter.eventName.updateVillageList, this.search);
  }

  componentWillMount() {
    this.search();
    SocketEmitter.on(SocketEmitter.eventName.updateVillageList, this.search);
  }

  /**跳转 */
  goPage(moduleName, data) {
    this.props.tab.goPage({
      moduleName,
      location: this.props.location,
      data
    });
  }

  /**
   * 搜索
   */
  search = () => {
    const { village } = this.props;
    this.setState({
      loading: true
    });

    return village.queryVillages().then(res => {
      if(res.code === 200 || res.code === 200000){
        this.setState({
          total: res.data.total || 0,
          list: res.data.list,
          loading: false
        });
      }else{
        message.error('获取列表失败')
        this.setState({loading: false})
      }
    });
  };

  /**修改查询条件 */
  editSearchData = options => {
    const { village } = this.props;
    village.mergeSearchData(options);
    this.search();
  };
  /**分页切换查询 */
  onChange = (page, pageSize) => {
    this.editSearchData({ page, pageSize });
  };

  resetVillage = item => {
    confirm({
      content: '确认重置小区数据？',
      onCancel: () => {},
      onOk: () => {
        return Service.community.resetVillage({ id: item.id }).then(
          (res) => {
            if(res.code === 200 || res.code === 200000){
              message.success('重置成功');
            }else{
              message.error('重置失败');
            }
            this.search();
          }
        );
      }
    });
  };

  onCancel = () => {
    this.setState({ visible: false });
    setTimeout(() => {
      this.setState({ currentVillage: {}, key: Math.random() });
    }, 500);
  };

  render() {
    const { village } = this.props;
    const { searchData } = village;
    const { list, total, loading } = this.state;
    return (
      <WrapperView
        name={"小区管理"}
        title={
          <Search
            value={searchData.key}
            onChange={this.editSearchData}
            goPage={this.goPage.bind(this)}
          />
        }
      >
        <div className="village-wrapper">
          <Table
            rowKey="villageId"
            total={total}
            goPage={this.goPage.bind(this)}
            searchData={searchData}
            dataSource={list}
            loading={loading}
            onChange={this.onChange}
            resetVillage={this.resetVillage}
            scroll={{ y: "100%" }}
          />
        </div>
      </WrapperView>
    );
  }
}

export default VillageListView;
