import React, { Component } from "react";
import { observer } from "mobx-react";
import { Button, Form, Checkbox, message } from "antd";
import DropTarget from "./wrapper";
import { withRouter } from "react-router-dom";
import * as _ from "lodash";
import "./index.less";
import IconFont from "src/components/IconFont";

const FormItem = Form.Item;
const RouterList = Dict.map.systemModule;
const computTreeList = Utils.computTreeList;
const WrapperView = Loader.loadBusinessComponent("SystemWrapper");
const DragDropContextProvider = Loader.loadComponent(
  "ReactDnD",
  null,
  "DragDropContextProvider"
);

@withRouter
@Decorator.businessProvider("operationDetail", "tab", "user")
@Decorator.withEntryLog()
@observer
class roleMgr extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      checkAlls: false,
      indeterminate: false,
      checkSingles: false,
      initId: "",
      menuTreeList: [],
      moduleSort: [],
      HTML5Backend: null
    };
    this.menuList = _.cloneDeep(RouterList);
    this.menuList.forEach(y => (y.checked = false));
  }
  isAdd = true;
  menuTreeList = [];
  async componentWillMount() {
    let { location, operationDetail } = this.props;
    let initId = Utils.queryFormat(location.search).id;
    //详情就禁用各种输入框
    let res = await Service.operation.queryOperationCenterInitMenu({});
    let privs = res.data.privileges
      ? res.data.menus.concat(res.data.privileges)
      : [].concat(res.data.menus);
    let list = [];
    for (let i = 0, l = this.menuList.length; i < l; i++) {
      let item = this.menuList[i];
      let menu = privs.find(
        x => Number(x.id) === item.id || Number(x.privilegeCode) === item.id
      );
      if (menu) {
        item.text = menu.menuName || menu.privilegeName;
        item.moduleName = menu.moduleName || null;
        item.moduleId = menu.moduleId || null;
        item.sort = menu.sort || null;
        item.moduleSort = menu.moduleSort || null;
        list.push(item);
      }
      if (item.module) {
        list.push(item);
      }
    }
    list = _.sortBy(list, "moduleSort");
    this.menuList = list;
    let menuTreeList = computTreeList(
      this.menuList,
      undefined,
      undefined,
      true
    );

    // 后台取出的选中id
    let checkitem = [];
    Service.operation
      .queryOperationCenterMenuAndPrivileges(initId)
      .then(res => {
        checkitem = res.data.menus ? res.data.menus.map(v => Number(v.id)) : [];
        let checks = res.data.menus
          ? res.data.menus.map(v => {
              let item = {
                id: Number(v.id),
                menuId: Number(v.id),
                sort: v.sort,
                operationCenterId: initId
              };
              return item;
            })
          : [];
        //回显的全选半选状态
        let c = checkitem.length;
        let m = this.menuList.filter(x => !x.module).map(v => v.id).length;
        //所有菜单树结构
        this.setCheckedMenu(checkitem, menuTreeList);
        // 初始化privilegeIds
        operationDetail.moduleChange({
          menuIds: _.uniq(checks)
        });
        this.setState({
          menuTreeList,
          initId,
          checkAlls: c === m || c > m,
          indeterminate: c < m && c !== 0,
          loading: false
        });
      });
    Loader.loadScript("HTML5Backend", "default").then(HTML5Backend => {
      this.setState({ HTML5Backend });
    });
  }
  // 设置选中节点
  setCheckedMenu(checkitem, menuTreeList) {
    let menuList = _.cloneDeep(RouterList);
    // 获取用户的菜单树
    let myMenu = [];
    checkitem.map(v => {
      menuList.map(item => {
        if (v === item.id) {
          myMenu.push(item);
          if (item.parentId) {
            let items = menuList.filter(x => x.id === item.parentId);
            myMenu.push(items[0]);
            if (items[0].parentId) {
              let itemss = menuList.filter(y => y.id === items[0].parentId);
              myMenu.push(itemss[0]);
            }
          }
        }
      });
    });
    // 过滤重复
    let arr = [];
    myMenu.map(v => {
      if (arr.indexOf(v) < 0) {
        arr.push(v);
      }
    });
    let myMenuTree = computTreeList(arr, undefined, undefined, true);

    // 承接1/2树节点id
    let firstAndSec = [];
    // 单独获取一二级id
    let result = this.getfirstAndSecMenuChecked(
      firstAndSec,
      myMenuTree,
      menuTreeList
    );
    console.log("一级和二级id" + result);
    this.menuList.map(v => {
      // 设置按钮即 3 级菜单选中
      checkitem.map(x => {
        if (x === v.id) {
          v.checked = true;
        }
      });
      // 设置1、2菜单选中
      result.map(item => {
        if (v.id === item) {
          v.checked = true;
        }
      });
    });
  }
  // 递归获取1、2级菜单选中id
  getfirstAndSecMenuChecked(firstAndSec, myMenuTree, menuTreeList) {
    myMenuTree.map(item => {
      let target = menuTreeList.filter(v => item.id === v.id)[0];
      if (
        Array.isArray(item.children) &&
        item.children.length > 0 &&
        Array.isArray(target.children) &&
        target.children.length > 0
      ) {
        if (item.children.length === target.children.length) {
          if (firstAndSec.indexOf(item.id) < 0) {
            firstAndSec.push(item.id);
          }
        } else {
          // 判断二级菜单的父级
          if (item.parentId) {
            if (firstAndSec.indexOf(item.parentId) >= 0) {
              firstAndSec.splice(firstAndSec.indexOf(item.parentId), 1);
            }
          }
        }
      }
      if (
        Array.isArray(item.children) &&
        item.children.length > 0 &&
        target.children
      ) {
        this.getfirstAndSecMenuChecked(
          firstAndSec,
          item.children,
          target.children
        );
      }
    });
    return firstAndSec;
  }

  /**
   * checked递归
   */
  checksingles(v, checked) {
    let menuList = this.menuList;
    if (Array.isArray(v)) {
      v.map(v => {
        v.checked = checked;
        if (checked === true) {
          if (v.isSelect) {
            v.isSelect.map(m => {
              let item = menuList.filter(x => x.id === m);
              item.map(n => (n.checked = checked));
            });
          }
        } else {
          if (v.isCancel) {
            v.isCancel.map(m => {
              let item = menuList.filter(x => x.id === m);
              item.map(n => (n.checked = checked));
            });
          }
        }
        if (v.children) {
          this.checksingles(v.children, checked);
        }
      });
    } else {
      v.checked = checked;
      if (checked === true) {
        if (v.isSelect) {
          v.isSelect.map(m => {
            let item = menuList.filter(x => x.id === m);
            item.map(n => (n.checked = checked));
          });
        }
      } else {
        if (v.isCancel) {
          v.isCancel.map(m => {
            let item = menuList.filter(x => x.id === m);
            item.map(n => (n.checked = checked));
          });
        }
      }
      if (v.children) {
        this.checksingles(v.children, checked);
      }
    }
  }
  checkParents(menu, menuList) {
    let parentMenu = menuList.filter(v => menu.parentId === v.id)[0];
    if (parentMenu) {
      let arr = parentMenu.children.map(v => v.checked);
      if (!arr.includes(true) && arr.includes(false)) {
        parentMenu.checked = false;
      } else {
        parentMenu.checked = arr.includes(true);
      }
      if (parentMenu.parentId) {
        this.checkParents(parentMenu, menuList);
      }
    }
    return menuList;
  }

  /**
   * 全选
   */
  checkAll = e => {
    let menuList = this.menuList;
    let { operationDetail } = this.props;
    let { moduleChange } = operationDetail;
    const check = e.target.checked;
    menuList.map(v => (v.checked = check));
    this.setState({ checkAlls: check, indeterminate: false });
    this.forceUpdate();
    moduleChange({
      menuIds: menuList
        .filter(x => !x.module && x.checked === true)
        .map(v => {
          let item = {
            menuId: Number(v.id),
            sort: v.sort,
            operationCenterId: this.state.initId
          };
          return item;
        })
    });
  };

  /**
   * 单项/反选/半选
   */
  checkSingle(item) {
    let menuList = this.menuList;
    let { operationDetail } = this.props;
    let { moduleChange } = operationDetail;
    const checked = !item.checked;

    let menu = menuList.find(v => v.id === item.id);
    this.checksingles(menu, checked);
    menuList = this.checkParents(menu, menuList);
    let data = [];
    menuList
      .filter(x => !x.module)
      .map(v => {
        if (v.id && v.checked === true) {
          data.push({
            menuId: v.id,
            sort: v.sort,
            operationCenterId: this.state.initId
          });
        }
      });
    let arrs = menuList.map(v => v.checked === true);
    if (arrs.includes(false) && arrs.includes(true)) {
      this.setState({ checkAlls: false, indeterminate: true });
    } else {
      this.setState({ checkAlls: !arrs.includes(false), indeterminate: false });
    }

    this.forceUpdate();
    // 保存选中权限到后台
    moduleChange({ menuIds: _.uniq(data) });
  }
  /**
   * 渲染checkbox
   */
  renderCheckedModule(treeData) {
    // console.log("treeData", treeData);
    return treeData.map((item, index) => {
      const children = (
        <span className={item.parentId && item.children ? "firSon" : "secSon"}>
          {item.parentId ? (
            <Checkbox
              onChange={this.checkSingle.bind(this, item)}
              checked={item.checked}
            >
              {item.text}
            </Checkbox>
          ) : item.children && item.children.length > 0 ? (
            <DropTarget
              index={index}
              key={item.id}
              id={item.id}
              moveCard={this.moveCard}
              className="module"
            >
              {item.module}
              <IconFont
                type="icon-Drug_Main"
                style={{ float: "right", fontSize: "16px" }}
              />
            </DropTarget>
          ) : (
            ""
          )}
          {Array.isArray(item.children) &&
            item.children.length > 0 &&
            this.renderCheckedModule(item.children)}
        </span>
      );
      return <span key={item.id}>{children}</span>;
    });
  }
  // 保存操作
  handleSave = () => {
    let { form, user, operationDetail } = this.props;
    let { menuTreeList, initId } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      let pidList = operationDetail.privilegeInfo.menuIds;
      if (!pidList.length) {
        message.error("请配置至少一个模块！");
        return;
      }
      this.setState({
        btnLoad: true
      });
      let moduleList = [];
      menuTreeList.map((v, index) => {
        moduleList.push({
          operationCenterId: initId,
          moduleId: v.id,
          sort: (index + 1) * 10
        });
      });
      let moduleInfo = {
        menuList: pidList,
        moduleList
      };
      Service.operation
        .changeOperationCenterModuleMenu(moduleInfo)
        .then(() => {
          message.success("模块配置成功");
          this.setState({
            btnLoad: false
          });
          this.handleCancel();
        })
        .catch(() => {
          this.setState({
            btnLoad: false
          });
        });
    });
  };
  // 取消操作
  handleCancel = () => {
    this.setState({ initId: "" });
    SocketEmitter.emit("updateRoleList");
    this.props.tab.closeCurrentTab({
      location: this.props.location
    });
  };

  //
  moveCard = (id, index) => {
    const { menuTreeList } = this.state;
    const sourceCard = menuTreeList.find(card => card.id === id);
    const sortCards = menuTreeList.filter(card => card.id !== id);
    sortCards.splice(index, 0, sourceCard);
    this.setState({ menuTreeList: sortCards });
    // console.log('menuTreeList',menuTreeList)
    // console.log('sortCards',sortCards)
  };

  render() {
    let {
      key,
      checkAlls,
      initId,
      indeterminate,
      menuTreeList,
      loading,
      HTML5Backend
    } = this.state;
    if (!HTML5Backend) {
      return null;
    }
    return (
      <WrapperView width={"100%"} name={""}>
        <div className="module-edit-contanier">
          <div className="module-edit">
            <div className="baseInfo">
              <Form
                onSubmit={this.handleSave.bind(this)}
                autoComplete="off"
                className="roleForm"
                key={key}
              >
                {/* <Spin
                      spinning={loading}
                      style={{ position: "fixed", top: "40%", left: "50%" }}
                    /> */}
                <div className="pid-info">
                  <div className="check-all">
                    <FormItem>
                      <Checkbox
                        indeterminate={indeterminate}
                        checked={checkAlls}
                        onClick={e => this.checkAll(e)}
                        style={{ paddingLeft: "20px", marginTop: "20px" }}
                      >
                        全选
                      </Checkbox>
                    </FormItem>
                    <DragDropContextProvider backend={HTML5Backend}>
                      <div
                        className="checkbox-group"
                        style={{
                          height: "calc(100% - 52px)"
                        }}
                      >
                        {this.renderCheckedModule(menuTreeList)}
                      </div>
                    </DragDropContextProvider>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
        <div className="setting-edit-btns role-btn">
          <Button
            className="save-btn ant-btn"
            type="primary"
            name="save-btn"
            onClick={this.handleCancel}
            style={{ display: this.isView ? "block" : "none" }}
          >
            返回
          </Button>
          <Button
            className="cancel-btn ant-btn"
            name="cancel-btn"
            onClick={this.handleCancel}
            style={{ display: this.isView ? "none" : "inline-block" }}
          >
            取消
          </Button>
          <Button
            className="save-btn ant-btn"
            type="primary"
            loading={this.state.btnLoad}
            name="save-btn"
            onClick={this.handleSave.bind(this)}
            style={{ display: this.isView ? "none" : "inline-block" }}
          >
            保存
          </Button>
        </div>
      </WrapperView>
    );
  }
}

export default Form.create()(roleMgr);
