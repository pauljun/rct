import React from "react";
import { Popover, Checkbox } from "antd";
import { observer } from "mobx-react";
import { Promise } from "q";
import { toJS } from "mobx";

const InputAfter = Loader.loadBaseComponent("InputAfter");
const VillageMesDetail = Loader.loadBusinessComponent("VillageMesDetail");

@Decorator.businessProvider("flowPerson", "residentPerson")
@observer
class VillageResource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectIf: true,
      choseId: undefined,
      show: false,
      villageList: [],
      value: "",
      passVillageList: [],
      otherCommunityData: []
    };
    this.requestVillageData();
    this.i = 0;
  }
  requestVillageData = () => {
    Service.community.statisticsList({ limit: 1000, offset: 0 }).then(res => {
      this.setState({
        villageList: res.list,
        passVillageList: res.list
      });
      let arr = [];
      res.list.map(v => arr.push(v.id));
      if (arr.length == 0) {
        return;
      }
      Promise.all([
        Service.community.countVillagePeople({ villageIds: arr }),
        Service.community.countVillageDevice({ villageIds: arr }),
        Service.community.countFace({ villageIds: arr, days: 7 })
      ]).then(res => {
        let data = res[0];
        res[1].map(item => {
          try {
            Object.assign(data.find(v => v.id === item.id), item);
          } catch (e) {}
        });
        res[2].map(item => {
          try {
            Object.assign(data.find(v => v.id === item.villageId), item);
          } catch (e) {}
        });
        this.setState({
          otherCommunityData: data
        });
      });
    });
  };
  handleVillageSelect = id => {
    const { residentPerson, type, flowPerson, activeKey } = this.props;
    const { passVillageList, choseId } = this.state;
    this.props.handleSelctId();
    if (type == "registered") {
      residentPerson.initSearchData(1);
      residentPerson.editSearchData({ villageIds: [id] }, 1);
      residentPerson.initSearchData(2);
      residentPerson.editSearchData({ villageIds: [id] }, 2);
      residentPerson.initSearchData(3);
      residentPerson.editSearchData({ villageIds: [id] }, 3);
    } else {
      flowPerson.initSearchData(1);
      flowPerson.editSearchData({ villageIds: [id] }, 1);
      flowPerson.initSearchData(2);
      flowPerson.editSearchData({ villageIds: [id] }, 2);
      flowPerson.initSearchData(3);
      flowPerson.editSearchData({ villageIds: [id] }, 3);
    }
    /**点击选中的社区，全选按钮选中 */
    if (id == choseId) {
      this.setState({
        choseId: undefined,
        selectIf: true
      });
      this.props.requestUnappear();
      this.props.requestData();
      this.props.requestAllPerson();
      return;
    }
    this.props.requestUnappear(true);
    this.props.requestData(true);
    this.props.requestAllPerson(true);
    if (passVillageList.length > 1) {
      this.setState({
        selectIf: false
      });
    } else {
      this.setState({
        selectIf: true
      });
    }
    this.setState({
      choseId: id,
      show: true
    });
    setTimeout(() => {
      this.mergeSearchData();
    }, 100);
  };
  /**条件搜索社区 */
  handleVillageInputSearch = e => {
    clearTimeout(this.SearchVillage);
    const { residentPerson, flowPerson, type, activeKey } = this.props;
    const { passVillageList } = this.state;
    this.setState({
      value: e.target.value
    });
    let keywords = e.target.value;
    /**重置搜索条件 */
    this.props.handleSelctId();
    this.SearchVillage = setTimeout(() => {
      Service.community
        .statisticsList({
          limit: 1000,
          offset: 0,
          keywords
        })
        .then(res => {
          if (res.list.length == passVillageList.length) {
            this.setState({
              selectIf: true
            });
          } else {
            this.setState({
              selectIf: false
            });
          }
          this.setState({
            choseId: undefined,
            villageList: res.list
          });
          if (res.list.length == 0) {
            this.props.HandleNoVillageData();
            return;
          }
          if (keywords.length == 0) {
            this.setState({
              selectIf: true
            });
          }
          /**初始化搜素条件，并将id放入数组中 */
          if (type == "registered") {
            residentPerson.initSearchData(1);
            residentPerson.editSearchData(
              { villageIds: res.list.map(v => v.id) },
              1
            );
            residentPerson.initSearchData(2);
            residentPerson.editSearchData(
              { villageIds: res.list.map(v => v.id) },
              2
            );
            residentPerson.initSearchData(3);
            residentPerson.editSearchData(
              { villageIds: res.list.map(v => v.id) },
              3
            );
          } else {
            flowPerson.initSearchData(1);
            flowPerson.editSearchData(
              { villageIds: res.list.map(v => v.id) },
              1
            );
            flowPerson.initSearchData(2);
            flowPerson.editSearchData(
              { villageIds: res.list.map(v => v.id) },
              2
            );
            flowPerson.initSearchData(3);
            flowPerson.editSearchData(
              { villageIds: res.list.map(v => v.id) },
              3
            );
          }
         /*  setTimeout(() => {
            this.mergeSearchData();
          }, 100); */
          this.props.requestUnappear(true);
          this.props.requestData(true);
          this.props.requestAllPerson(true);
        });
    }, 500);
  };
  handleSelect = e => {
    const { residentPerson, type, flowPerson, activeKey } = this.props;
    this.props.handleSelctId();
    if (type == "registered") {
      residentPerson.initSearchData(1);
      residentPerson.initSearchData(2);
      residentPerson.initSearchData(3);
    } else {
      flowPerson.initSearchData(1);
      flowPerson.initSearchData(2);
      flowPerson.initSearchData(3);
    }
    this.setState({
      selectIf: true,
      choseId: undefined
    });
    this.requestVillageData();
    if (!this.state.selectIf) {
      setTimeout(() => {
        this.mergeSearchData();
      }, 100);
      this.props.requestData(true);
      this.props.requestUnappear(true);
      this.props.requestAllPerson(true);
      this.setState({
        value: ""
      });
    }
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.choseId && nextProps.selectIf == false) {
      if (this.i < 1) {
        this.setState({
          choseId: nextProps.choseId,
          selectIf: nextProps.selectIf
        });
      }
      this.i = this.i + 1;
    }
  }
  onCancel = () => {
    this.setState({
      value: "",
      selectIf: true
    });
    this.requestVillageData();
    /* setTimeout(() => {
      this.mergeSearchData();
    }, 100); */
    this.props.requestData();
    this.props.requestUnappear();
    this.props.requestAllPerson();
  };
  mergeSearchData = () => {
    let { activeKey, type } = this.props;
    let { selectIf, choseId } = this.state;
    let that = this;
    const id = Utils.uuid();
    LM_DB.add("parameter", {
      id,
      selectIf,
      choseId,
      activeKey: activeKey,
      communitySearchdata:
        type == "registered"
          ? toJS(
              activeKey == 1
                ? this.props.residentPerson.searchOption
                : activeKey == 2
                ? this.props.residentPerson.searchOptionUnappear
                : this.props.residentPerson.allSearchOption
            )
          : toJS(
              activeKey == 1
                ? this.props.flowPerson.FloatsearchOption
                : activeKey == 2
                ? this.props.flowPerson.FloatsearchOptionUnappear
                : this.props.flowPerson.allFloatSearchOption
            )
    }).then(() => {
      that.props.updateUrl(id);
    });
  };
  render() {
    const { selectIf, choseId, villageList, otherCommunityData } = this.state;
    const { type } = this.props;
    return (
      <React.Fragment>
        <div className="community-title-real" style={{ margin: 0 }}>
          <div>
            {type == "registered" ? "已登记人员管理" : "未登记人员管理"}
          </div>
          <div className="community-checkbox">
            全部显示
            <span style={{ paddingLeft: "6px" }}>
              <Popover
                overlayClassName={"checkbox-span-pop-community"}
                placement="bottom"
                content={
                  selectIf ? (
                    <span>
                      {type == "registered"
                        ? "请选择下面列表查看单个小区登记人口"
                        : "请选择下面列表查看单个小区未登记人口"}
                    </span>
                  ) : (
                    <span>
                      {type == "registered"
                        ? "全部显示小区登记人口"
                        : "全部显示小区未登记人口"}
                    </span>
                  )
                }
              >
                <Checkbox
                  onChange={this.handleSelect}
                  checked={this.state.selectIf}
                />
              </Popover>
            </span>
          </div>
        </div>
        <div className="community-input">
          <InputAfter
            placeholder="请输入小区名称搜索"
            size={"lg"}
            style={{ color: "rgba(0,0,0,.25)" }}
            value={this.state.value}
            onChange={this.handleVillageInputSearch}
            onCancel={this.onCancel}
          />
        </div>
        <div className="community-exp">
          {villageList.map((v, index) => (
            <VillageMesDetail
              queryVillageResoure={this.props.queryVillageResoure}
              type={type}
              key={index}
              data={v}
              otherData={otherCommunityData.filter(a => a.id == v.id)}
              choseId={choseId}
              handleVillageSelect={this.handleVillageSelect}
            />
          ))}
        </div>
      </React.Fragment>
    );
  }
}
export default VillageResource;
