import React from 'react';
import { Popover } from 'antd';
import '../style/screenChoise.less';

const IconFont = Loader.loadBaseComponent('IconFont')
const libScreen = Dict.getDict('videoScreen')

export default class ScreenChoise extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  showChangeScreent = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  };
  selectScreen = item => {
    this.setState({ visible: false });
    this.props.selectSrceen(item);
  };
  createHoverContent = () => {
    const { currentScreen } = this.props;
    return (
      <ul className="select-screen">
        {libScreen.map(item => (
          <li
            key={item.value}
            onClick={() => this.selectScreen(item)}
            className={`screen-item ${
              currentScreen.value === item.value ? 'active' : ''
            }`}
          >
            <IconFont className="icon-primary" type={item.icon} />
            {item.label}
          </li>
        ))}
      </ul>
    );
  };
  render() {
    const { visible } = this.state;
    const { currentScreen, getPopupContainer, className } = this.props;
    return (
      <Popover
        visible={visible}
        placement="bottom"
        content={this.createHoverContent()}
        getPopupContainer={() => getPopupContainer()}
      >
        <div
          className={`tools-split-screen ${className ? className : ''} ${
            visible ? 'active' : ''
          }`}
          onClick={() => this.showChangeScreent()}
        >
          <IconFont className="icon-primary" type={currentScreen.icon} theme="outlined" />
          {currentScreen.label}
          <IconFont
            className="icon-primary"
            style={{ float: 'right', paddingTop: 10 }}
            type={
              visible ? 'icon-Arrow_Small_Up_Main' : 'icon-Arrow_Small_Down_Mai'
            }
          />
        </div>
      </Popover>
    );
  }
}
