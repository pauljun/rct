import React from 'react';
import { Icon, Checkbox, Tooltip } from 'antd';
const AuthComponent = Loader.loadBusinessComponent('AuthComponent')
const IconFont = Loader.loadBaseComponent('IconFont')
const ImageView = Loader.loadBaseComponent('ImageView');
const svgNoData = Loader.NoData;

const CollapsePanelItem = ({ 
  item,
  editStatus,
  onDownloadOne,
  onCopyLink,
  onDeleteOne,
  onVideoPlay,
  onImageView
}) => (
  <div className='list-item-wrapper clearfix'>
    { !editStatus && (
      <Checkbox
        className='check-item'
        value={item.id}
      />
    )}
    <div className='item-img-wrapper fl'>
      {item.imgUrl 
        ? <ImageView className='item-img-small' src={item.imgUrl} />
        : <img className='item-img-small' src={svgNoData} />
      }
      { item.type === 'video' && (
        <Icon
          type='caret-right'
          onClick={() => { onVideoPlay&&onVideoPlay(item)}}
        />
      )}
      { item.type === 'image' && (
        <Icon 
          type='picture' 
          onClick={() => { onImageView&&onImageView(item) }}
        />
      )}
    </div>
    <div className='item-info-wrapper fr'>
      <div className='item-time-wrapper'>
        {
          item.type==='image'
          ? <p>{item.captureTime}</p>
          : [<p key='startTime'>{item.startTime}</p>,<p key='endTime'>{item.endTime}</p>]
        }
      </div>
      { editStatus && 
        <div className='item-operate-wrapper'>
          {/* <Tooltip title="复制下载链接">
            <Icon type='copy' title='复制下载链接' onClick={() => onCopyLink(item)} />
          </Tooltip> */}
          <AuthComponent actionName={item.type === 'image' ? 'BaselibImgDownload' : 'DownloadVideo'}>
            <Tooltip title="下载">
              <IconFont type='icon-Download_Main' title='下载' onClick={() => onDownloadOne(item)} />
            </Tooltip>
          </AuthComponent>
          <Tooltip title="删除">
            <IconFont type='icon-Delete_Main' title='删除' onClick={() => onDeleteOne(item)} /> 
          </Tooltip>
        </div>
      }
    </div>
  </div>
)

export default CollapsePanelItem