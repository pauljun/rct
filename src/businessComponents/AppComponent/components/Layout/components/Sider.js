import React from "react";
import { Layout } from "antd";
import { observer, inject } from "mobx-react";
import { MenuList } from "./MenuList";
import { withRouter } from "react-router-dom";

const { Sider } = Layout;

@withRouter
@inject("tab", "menu")
@observer
class SiderView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true
    };
  }
  slideCollapsed = () => {
    clearTimeout(this.timer);
    this.setState({ collapsed: false });
  };
  closeCollapsed = () => {
    this.timer = setTimeout(() => {
      if (!this.state.collapsed) {
        this.setState({ collapsed: true });
      }
    }, 300);
  };
  /**
   * 点击菜单
   * @param {*} param0
   */
  menuClick = ({ key, domEvent }) => {
    const { tab, menu, location } = this.props;
    const moduleName = key;
    const isUpdate = !(domEvent.ctrlKey || domEvent.metaKey);
    const menuInfo = menu.getInfoByName(moduleName);
    if (Array.isArray(menuInfo.includeNames)) {
      const includeMenus = menuInfo.includeNames
        .map(v => menu.getInfoByName(v))
        .filter(v => !!v);
      if (includeMenus[0]) {
        menu.setCurrentMenu(key);
        tab.goPage({ moduleName: includeMenus[0].name, location, isUpdate });
      }
    } else {
      menu.setCurrentMenu(key);
      tab.goPage({ moduleName, location, isUpdate });
    }
  };
  render() {
    const { menu } = this.props;
    const menuList = menu.userMenuList;
    const currentMenu = menu.currentMenu;
    const { collapsed } = this.state;
    return (
      <Sider
        className={`left-menu ${collapsed ? "left-menu-collapsed" : ""}`}
        collapsible
        collapsed={collapsed}
        trigger={null}
      >
        <div
          className="menu-content-layout"
          onMouseEnter={this.slideCollapsed}
          onMouseMove={this.slideCollapsed}
          onMouseLeave={this.closeCollapsed}
        >
          <div className="scroller-layout-menu">
            <MenuList
              menuMode={collapsed}
              currentMenu={currentMenu}
              menuList={menuList}
              menuClick={this.menuClick}
            />
          </div>
        </div>
      </Sider>
    );
  }
}

export default SiderView;
