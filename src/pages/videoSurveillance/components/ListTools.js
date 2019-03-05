import React from 'react';
import ScreenChoise from './ScreenChoise';
import { videoContext } from '../moduleContext';
import '../style/listTools.less';

const FullScreenLayout = Loader.loadBaseComponent('FullScreenLayout')
const IconFont = Loader.loadBaseComponent('IconFont')

@videoContext
class ListTools extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      currentScreen,
      closeVideo,
      selectSrceen,
      isLoop,
      stopLoop,
      videoLayoutDom
    } = this.props;
    return (
      <div className="video-list-tools">
        <div className="split-screen-popup-layout" />
        <div className="tools-layout">
          <ScreenChoise
            currentScreen={currentScreen}
            selectSrceen={selectSrceen}
            getPopupContainer={() =>
              videoLayoutDom.querySelector('.split-screen-popup-layout')
            }
          />
          <FullScreenLayout
            className="tools-screen"
            getContainer={() =>
              videoLayoutDom.querySelector('.player-mutipart-layout')
            }
          />

          <div
            className="tools-draw"
            onClick={() => (isLoop ? stopLoop() : closeVideo())}
          >
            <IconFont type="icon-Close_Main1" className="icon-primary" theme="outlined" />
            {isLoop ? '结束轮巡' : '关闭'}
          </div>
        </div>
      </div>
    );
  }
}
export default ListTools