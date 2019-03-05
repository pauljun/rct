import React from 'react';
import { Menu } from 'antd';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import './index.less';
const IconFont = Loader.loadBaseComponent('IconFont')
const title = ['重点人员布控', '外来人员布控', '魅影布防', '专网套件布控']
const menuListInfo = [
  ['keyPersonnelHistory', 'keyPersonnelTaskView', 'keyPersonnelLibraryView'],
  ['outsiderHistory', 'outsiderTaskView', 'outsiderLibraryView'],
  ['eventHistoryNotify','eventTaskView'],
  ['privateNetHistory', 'privateNetTaskView', 'privateNetLibraryView'],
]

@withRouter
@inject('menu', 'tab')
@observer
class MonitorNavigation extends React.Component {
  constructor(props){
    super(props)
    const { libType=1, menu} = this.props
    const menuListNames = menuListInfo[libType - 1]
    this.menuList = menu.authList.filter(item => menuListNames.indexOf(item.name) > -1) || []
  }
  handleClick = (e) => {
    const { tab, location } = this.props;
    tab.goPage({
      moduleName: e.key,
      location,
      isUpdate: true,
      action: 'replace'
    })
  }
  render(){
    const { contentClass='', libType=1, currentMenu, children=null } = this.props
    return <React.Fragment>
      <div className="monitor-container-outer">
        <div className="monitor-header">
          <div className="monitor-title">{title[libType - 1]}</div>
          <Menu
            onClick={this.handleClick}
            mode="horizontal"
            className="menu-tab-style"
            selectedKeys={[currentMenu]}
          >
            {Array.isArray(this.menuList) && this.menuList.map((item, index) => (
              <Menu.Item key={item.name}>
                {item.icon && <IconFont type={item.icon} style={{fontSize:'16px'}} theme="outlined" />}
                {item.title}
              </Menu.Item>
            ))}
          </Menu>
        </div>
        <div className={`monitor-content ${contentClass}`}>
        { children }
        </div>
      </div>
    </React.Fragment>
  }
}
export default MonitorNavigation;