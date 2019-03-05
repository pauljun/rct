import React from 'react';
import Shared from 'src/shared';
import '../style/video.scss';


const PlayComponent = Loader.loadBusinessComponent('Player')

class VideoView extends React.PureComponent {
  closeVideo = event => {
    Utils.stopPropagation(event);
    this.props.closeVideo && this.props.closeVideo();
  };
  render() {
    const { info, setPlayMethods,hasDownload,hasScreenshot, handleRectSearch } = this.props;
    const fileData = info || {};
    return (
      <div className="camera-video-map">
        <PlayComponent
          fileData={fileData}
          isLiving={fileData.isLiving}
          hasDownload={hasDownload}
          hasScreenshot={hasScreenshot}
          method={{
            closeVideo: event => this.closeVideo(event),
            setPlayMethods,
            downloadVideo: options => Shared.downloadVideo({ fileData, ...options }),
            handleRectSearch,
          }}
        />
      </div>
    );
  }
}

export default VideoView