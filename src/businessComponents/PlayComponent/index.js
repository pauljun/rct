import React from 'react';

const Player = Loader.loadBusinessComponent('Player');

@Decorator.businessProvider('device')
class PlayComponent extends React.Component {
  render() {
    const { fileData = {}, hasLiving=true, children } = this.props;
    const hasDownload = true;
    const hasHistory = !!BaseStore.menu.getInfoByName('historyVideo');
    // const hasDownload = !!BaseStore.menu.getInfoByName('downloadVideo');
    return (
      <Player
        {...this.props}
        hasHistory={hasHistory}
        hasLiving={hasLiving}
        hasDownload={hasDownload}
        ptzControl={fileData.deviceType * 1 === 100602}
      >
        {children}
      </Player>
    );
  }
}
export default PlayComponent;