import React from 'react';
import '../style/message.scss';

const IconFont = Loader.loadBaseComponent('IconFont')


export default function() {
  return (
    <div className="video-message-layout vidie-empty-data">
      <IconFont className="no-data-icon" type="icon-PlaySource" />
      <span>请选择播放源</span>
    </div>
  );
}
